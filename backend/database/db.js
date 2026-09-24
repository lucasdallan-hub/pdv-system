const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'pdv.db');
const db = new sqlite3.Database(DB_PATH);

const Database = {
  initialize: function() {
    db.serialize(() => {
      // Tabela de Clientes
      db.run(`
        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          phone TEXT,
          email TEXT,
          cpf_cnpj TEXT UNIQUE,
          address TEXT,
          city TEXT,
          state TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela de Vendas
      db.run(`
        CREATE TABLE IF NOT EXISTS sales (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_id INTEGER,
          total_amount DECIMAL(10, 2) NOT NULL,
          payment_method TEXT,
          sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'completed',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(customer_id) REFERENCES customers(id)
        )
      `);

      // Tabela de Itens de Venda
      db.run(`
        CREATE TABLE IF NOT EXISTS sale_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sale_id INTEGER NOT NULL,
          product_name TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          unit_price DECIMAL(10, 2) NOT NULL,
          subtotal DECIMAL(10, 2) NOT NULL,
          FOREIGN KEY(sale_id) REFERENCES sales(id)
        )
      `);

      // Tabela de Recebimentos
      db.run(`
        CREATE TABLE IF NOT EXISTS receives (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_id INTEGER,
          sale_id INTEGER,
          description TEXT,
          amount DECIMAL(10, 2) NOT NULL,
          payment_method TEXT,
          receive_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'pending',
          due_date DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(customer_id) REFERENCES customers(id),
          FOREIGN KEY(sale_id) REFERENCES sales(id)
        )
      `);

      // Tabela de Pagamentos
      db.run(`
        CREATE TABLE IF NOT EXISTS payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          description TEXT NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          payment_method TEXT,
          category TEXT,
          payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'pending',
          due_date DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela de Notificações WhatsApp
      db.run(`
        CREATE TABLE IF NOT EXISTS whatsapp_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_id INTEGER,
          phone TEXT NOT NULL,
          message TEXT,
          type TEXT,
          status TEXT DEFAULT 'pending',
          response TEXT,
          sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(customer_id) REFERENCES customers(id)
        )
      `);

      console.log('✅ Database initialized successfully');
    });
  },

  get: function(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  all: function(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  run: function(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
};

module.exports = Database;
