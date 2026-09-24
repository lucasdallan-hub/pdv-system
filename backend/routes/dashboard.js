const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Dashboard resumo
router.get('/summary', async (req, res) => {
  try {
    // Total de vendas hoje
    const salestoday = await db.get(`
      SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total
      FROM sales
      WHERE DATE(sale_date) = DATE('now')
    `);

    // Total de recebimentos pendentes
    const receivePending = await db.get(`
      SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
      FROM receives
      WHERE status = 'pending'
    `);

    // Total de pagamentos pendentes
    const paymentsPending = await db.get(`
      SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE status = 'pending'
    `);

    // Recebimentos vencidos
    const receivesOverdue = await db.get(`
      SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
      FROM receives
      WHERE status = 'pending' AND due_date < datetime('now')
    `);

    // Pagamentos vencidos
    const paymentsOverdue = await db.get(`
      SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE status = 'pending' AND due_date < datetime('now')
    `);

    // Total de clientes
    const totalCustomers = await db.get(`
      SELECT COUNT(*) as count FROM customers
    `);

    // Vendas últimos 7 dias
    const salesLast7 = await db.all(`
      SELECT DATE(sale_date) as date, SUM(total_amount) as total
      FROM sales
      WHERE DATE(sale_date) >= DATE('now', '-7 days')
      GROUP BY DATE(sale_date)
      ORDER BY date DESC
    `);

    res.json({
      salestoday,
      receivePending,
      paymentsPending,
      receivesOverdue,
      paymentsOverdue,
      totalCustomers,
      salesLast7
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fluxo de caixa
router.get('/cashflow', async (req, res) => {
  try {
    const inflow = await db.get(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM receives
      WHERE status = 'received'
    `);

    const outflow = await db.get(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE status = 'paid'
    `);

    const balance = inflow.total - outflow.total;

    res.json({
      inflow: inflow.total,
      outflow: outflow.total,
      balance: balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Produtos mais vendidos
router.get('/top-products', async (req, res) => {
  try {
    const products = await db.all(`
      SELECT product_name, SUM(quantity) as total_qty, SUM(subtotal) as total_value
      FROM sale_items
      GROUP BY product_name
      ORDER BY total_qty DESC
      LIMIT 10
    `);

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
