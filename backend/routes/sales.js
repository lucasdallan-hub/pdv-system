const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// Criar nova venda
router.post('/', async (req, res) => {
  try {
    const { customer_id, items, payment_method } = req.body;

    let total_amount = 0;
    items.forEach(item => {
      total_amount += item.quantity * item.unit_price;
    });

    const result = await db.run(
      `INSERT INTO sales (customer_id, total_amount, payment_method, status)
       VALUES (?, ?, ?, 'completed')`,
      [customer_id, total_amount, payment_method]
    );

    const sale_id = result.id;

    // Inserir itens da venda
    for (const item of items) {
      const subtotal = item.quantity * item.unit_price;
      await db.run(
        `INSERT INTO sale_items (sale_id, product_name, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [sale_id, item.product_name, item.quantity, item.unit_price, subtotal]
      );
    }

    // Se not cash, criar recebimento
    if (payment_method !== 'cash') {
      await db.run(
        `INSERT INTO receives (customer_id, sale_id, description, amount, payment_method, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [customer_id, sale_id, 'Venda #' + sale_id, total_amount, payment_method]
      );
    }

    res.status(201).json({
      success: true,
      sale_id: sale_id,
      total: total_amount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar vendas
router.get('/', async (req, res) => {
  try {
    const sales = await db.all(`
      SELECT s.*, c.name as customer_name
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      ORDER BY s.sale_date DESC
      LIMIT 100
    `);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Detalhe da venda
router.get('/:id', async (req, res) => {
  try {
    const sale = await db.get(
      `SELECT s.*, c.name as customer_name, c.phone
       FROM sales s
       LEFT JOIN customers c ON s.customer_id = c.id
       WHERE s.id = ?`,
      [req.params.id]
    );

    const items = await db.all(
      `SELECT * FROM sale_items WHERE sale_id = ?`,
      [req.params.id]
    );

    res.json({ sale, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar venda
router.delete('/:id', async (req, res) => {
  try {
    // Deletar itens da venda primeiro
    await db.run('DELETE FROM sale_items WHERE sale_id = ?', [req.params.id]);

    // Deletar recebimentos associados
    await db.run('DELETE FROM receives WHERE sale_id = ?', [req.params.id]);

    // Deletar a venda
    await db.run('DELETE FROM sales WHERE id = ?', [req.params.id]);

    res.json({ success: true, message: 'Venda deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
