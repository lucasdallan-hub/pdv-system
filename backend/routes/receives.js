const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar recebimentos pendentes
router.get('/', async (req, res) => {
  try {
    const receives = await db.all(`
      SELECT r.*, c.name as customer_name, c.phone
      FROM receives r
      LEFT JOIN customers c ON r.customer_id = c.id
      WHERE r.status = 'pending'
      ORDER BY r.due_date ASC
    `);

    res.json(receives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar recebimento manual
router.post('/', async (req, res) => {
  try {
    const { customer_id, description, amount, due_date } = req.body;

    const result = await db.run(
      `INSERT INTO receives (customer_id, description, amount, due_date, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [customer_id, description, amount, due_date]
    );

    res.status(201).json({
      success: true,
      receive_id: result.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Marcar como recebido
router.put('/:id/confirm', async (req, res) => {
  try {
    const { payment_method } = req.body;

    await db.run(
      `UPDATE receives
       SET status = 'received', payment_method = ?, receive_date = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [payment_method, req.params.id]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar vencidos
router.get('/overdue/list', async (req, res) => {
  try {
    const overdue = await db.all(`
      SELECT r.*, c.name as customer_name, c.phone,
             CAST((julianday('now') - julianday(r.due_date)) AS INTEGER) as days_overdue
      FROM receives r
      LEFT JOIN customers c ON r.customer_id = c.id
      WHERE r.status = 'pending' AND r.due_date < datetime('now')
      ORDER BY r.due_date ASC
    `);

    res.json(overdue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar recebimento
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM receives WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Recebimento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
