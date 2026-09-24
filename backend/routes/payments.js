const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar pagamentos a pagar
router.get('/', async (req, res) => {
  try {
    const payments = await db.all(`
      SELECT * FROM payments
      ORDER BY due_date ASC
    `);

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar novo pagamento a pagar
router.post('/', async (req, res) => {
  try {
    const { description, amount, category, due_date } = req.body;

    const result = await db.run(
      `INSERT INTO payments (description, amount, category, due_date, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [description, amount, category, due_date]
    );

    res.status(201).json({
      success: true,
      payment_id: result.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Marcar pagamento como pago
router.put('/:id/pay', async (req, res) => {
  try {
    const { payment_method } = req.body;

    await db.run(
      `UPDATE payments
       SET status = 'paid', payment_method = ?, payment_date = CURRENT_TIMESTAMP
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
      SELECT *,
             CAST((julianday('now') - julianday(due_date)) AS INTEGER) as days_overdue
      FROM payments
      WHERE status = 'pending' AND due_date < datetime('now')
      ORDER BY due_date ASC
    `);

    res.json(overdue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar pagamento
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM payments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Pagamento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
