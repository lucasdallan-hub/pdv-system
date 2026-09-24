const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar clientes
router.get('/', async (req, res) => {
  try {
    const customers = await db.all(`
      SELECT c.*,
             COUNT(DISTINCT s.id) as total_sales,
             SUM(s.total_amount) as total_spent
      FROM customers c
      LEFT JOIN sales s ON c.id = s.customer_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar cliente
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, cpf_cnpj, address, city, state } = req.body;

    const result = await db.run(
      `INSERT INTO customers (name, phone, email, cpf_cnpj, address, city, state)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, email, cpf_cnpj, address, city, state]
    );

    res.status(201).json({
      success: true,
      customer_id: result.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Detalhe do cliente
router.get('/:id', async (req, res) => {
  try {
    const customer = await db.get(
      `SELECT * FROM customers WHERE id = ?`,
      [req.params.id]
    );

    const sales = await db.all(
      `SELECT * FROM sales WHERE customer_id = ? ORDER BY sale_date DESC LIMIT 10`,
      [req.params.id]
    );

    const receives = await db.all(
      `SELECT * FROM receives WHERE customer_id = ? ORDER BY due_date DESC LIMIT 10`,
      [req.params.id]
    );

    res.json({ customer, sales, receives });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar cliente
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email, address, city, state } = req.body;

    await db.run(
      `UPDATE customers
       SET name = ?, phone = ?, email = ?, address = ?, city = ?, state = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, phone, email, address, city, state, req.params.id]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar cliente
router.delete('/:id', async (req, res) => {
  try {
    // Deletar todas as vendas do cliente
    await db.run('DELETE FROM sale_items WHERE sale_id IN (SELECT id FROM sales WHERE customer_id = ?)', [req.params.id]);
    await db.run('DELETE FROM sales WHERE customer_id = ?', [req.params.id]);

    // Deletar recebimentos
    await db.run('DELETE FROM receives WHERE customer_id = ?', [req.params.id]);

    // Deletar logs de whatsapp
    await db.run('DELETE FROM whatsapp_logs WHERE customer_id = ?', [req.params.id]);

    // Deletar cliente
    await db.run('DELETE FROM customers WHERE id = ?', [req.params.id]);

    res.json({ success: true, message: 'Cliente deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
