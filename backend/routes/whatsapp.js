const express = require('express');
const router = express.Router();
const db = require('../database/db');
const WuzAPI = require('../services/wuzapi');

// Enviar notificação de cobrança
router.post('/send-collection', async (req, res) => {
  try {
    const { receive_id } = req.body;

    const receive = await db.get(
      `SELECT r.*, c.name, c.phone FROM receives r
       LEFT JOIN customers c ON r.customer_id = c.id
       WHERE r.id = ?`,
      [receive_id]
    );

    if (!receive || !receive.phone) {
      return res.status(400).json({ error: 'Cliente ou telefone não encontrado' });
    }

    // Formatar número para Brasil
    let phone = receive.phone.replace(/\D/g, '');
    if (!phone.startsWith('55')) {
      phone = '55' + phone;
    }

    const dueDate = new Date(receive.due_date).toLocaleDateString('pt-BR');
    const result = await WuzAPI.sendCollectionNotice(
      phone,
      receive.name,
      receive.amount,
      dueDate
    );

    // Registrar envio
    await db.run(
      `INSERT INTO whatsapp_logs (customer_id, phone, message, type, status)
       VALUES (?, ?, ?, 'collection', ?)`,
      [receive.customer_id, phone, 'Cobrança enviada', result.success ? 'sent' : 'failed']
    );

    res.json({ success: result.success, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enviar notificação de vencido
router.post('/send-overdue', async (req, res) => {
  try {
    const { receive_id } = req.body;

    const receive = await db.get(
      `SELECT r.*, c.name, c.phone,
              CAST((julianday('now') - julianday(r.due_date)) AS INTEGER) as days_overdue
       FROM receives r
       LEFT JOIN customers c ON r.customer_id = c.id
       WHERE r.id = ?`,
      [receive_id]
    );

    if (!receive || !receive.phone) {
      return res.status(400).json({ error: 'Cliente ou telefone não encontrado' });
    }

    let phone = receive.phone.replace(/\D/g, '');
    if (!phone.startsWith('55')) {
      phone = '55' + phone;
    }

    const result = await WuzAPI.sendOverdueNotice(
      phone,
      receive.name,
      receive.amount,
      receive.days_overdue
    );

    await db.run(
      `INSERT INTO whatsapp_logs (customer_id, phone, message, type, status)
       VALUES (?, ?, ?, 'overdue', ?)`,
      [receive.customer_id, phone, 'Aviso de vencido enviado', result.success ? 'sent' : 'failed']
    );

    res.json({ success: result.success, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enviar comprovante de recebimento
router.post('/send-receipt', async (req, res) => {
  try {
    const { sale_id, customer_id } = req.body;

    const customer = await db.get(
      `SELECT * FROM customers WHERE id = ?`,
      [customer_id]
    );

    const sale = await db.get(
      `SELECT * FROM sales WHERE id = ?`,
      [sale_id]
    );

    if (!customer || !customer.phone) {
      return res.status(400).json({ error: 'Cliente ou telefone não encontrado' });
    }

    let phone = customer.phone.replace(/\D/g, '');
    if (!phone.startsWith('55')) {
      phone = '55' + phone;
    }

    const result = await WuzAPI.sendReceiptConfirmation(
      phone,
      customer.name,
      sale.total_amount,
      sale_id
    );

    await db.run(
      `INSERT INTO whatsapp_logs (customer_id, phone, message, type, status)
       VALUES (?, ?, ?, 'receipt', ?)`,
      [customer_id, phone, 'Comprovante enviado', result.success ? 'sent' : 'failed']
    );

    res.json({ success: result.success, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enviar notificação em massa para todos os vencidos
router.post('/send-bulk-collections', async (req, res) => {
  try {
    const overdue = await db.all(`
      SELECT r.*, c.name, c.phone,
             CAST((julianday('now') - julianday(r.due_date)) AS INTEGER) as days_overdue
      FROM receives r
      LEFT JOIN customers c ON r.customer_id = c.id
      WHERE r.status = 'pending' AND r.due_date < datetime('now')
    `);

    const results = [];
    for (const receive of overdue) {
      let phone = receive.phone.replace(/\D/g, '');
      if (!phone.startsWith('55')) {
        phone = '55' + phone;
      }

      const result = await WuzAPI.sendOverdueNotice(
        phone,
        receive.name,
        receive.amount,
        receive.days_overdue
      );

      results.push({
        customer: receive.name,
        phone,
        success: result.success
      });

      // Pequeno delay para não sobrecarregar API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    res.json({
      total: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Histórico de mensagens
router.get('/logs', async (req, res) => {
  try {
    const logs = await db.all(`
      SELECT l.*, c.name
      FROM whatsapp_logs l
      LEFT JOIN customers c ON l.customer_id = c.id
      ORDER BY l.sent_at DESC
      LIMIT 100
    `);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
