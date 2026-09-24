const db = require('../database/db');

async function seedData() {
  try {
    console.log('🌱 Iniciando população de dados de teste...\n');

    // Clientes de teste
    const customers = [
      {
        name: 'João Silva',
        phone: '11999999999',
        email: 'joao@email.com',
        cpf_cnpj: '12345678901234',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP'
      },
      {
        name: 'Maria Santos',
        phone: '21988888888',
        email: 'maria@email.com',
        cpf_cnpj: '98765432100000',
        address: 'Av. Brasil, 456',
        city: 'Rio de Janeiro',
        state: 'RJ'
      },
      {
        name: 'Pedro Oliveira',
        phone: '85987654321',
        email: 'pedro@email.com',
        cpf_cnpj: '55555555555555',
        address: 'Rua das Palmeiras, 789',
        city: 'Fortaleza',
        state: 'CE'
      },
      {
        name: 'Ana Costa',
        phone: '47999999888',
        email: 'ana@email.com',
        cpf_cnpj: '77777777777777',
        address: 'Rua das Acácias, 321',
        city: 'Santa Catarina',
        state: 'SC'
      }
    ];

    console.log('👥 Criando clientes...');
    const customerIds = [];
    for (const customer of customers) {
      const result = await db.run(
        `INSERT INTO customers (name, phone, email, cpf_cnpj, address, city, state)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [customer.name, customer.phone, customer.email, customer.cpf_cnpj, customer.address, customer.city, customer.state]
      );
      customerIds.push(result.id);
      console.log(`  ✓ ${customer.name} (ID: ${result.id})`);
    }

    // Vendas de teste
    console.log('\n🛒 Criando vendas...');
    const sales = [
      { customerId: customerIds[0], total: 500, method: 'card' },
      { customerId: customerIds[1], total: 1500, method: 'transfer' },
      { customerId: customerIds[2], total: 750, method: 'cash' },
      { customerId: customerIds[3], total: 2000, method: 'card' }
    ];

    const saleIds = [];
    for (const sale of sales) {
      const result = await db.run(
        `INSERT INTO sales (customer_id, total_amount, payment_method, status)
         VALUES (?, ?, ?, 'completed')`,
        [sale.customerId, sale.total, sale.method]
      );
      saleIds.push(result.id);

      // Criar itens da venda
      await db.run(
        `INSERT INTO sale_items (sale_id, product_name, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [result.id, 'Produto de Teste', 1, sale.total, sale.total]
      );

      console.log(`  ✓ Venda #${result.id} - R$ ${sale.total.toFixed(2)}`);
    }

    // Recebimentos de teste
    console.log('\n💰 Criando recebimentos...');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 5);
    const overdueDateStr = overdueDate.toISOString().split('T')[0];

    const receives = [
      { customerId: customerIds[0], saleId: saleIds[0], amount: 500, dueDate: futureDateStr, desc: 'Venda Pendente' },
      { customerId: customerIds[1], saleId: saleIds[1], amount: 1500, dueDate: overdueDateStr, desc: 'Venda Vencida' },
      { customerId: customerIds[2], saleId: saleIds[2], amount: 750, dueDate: futureDateStr, desc: 'Venda Pendente' },
      { customerId: customerIds[3], saleId: saleIds[3], amount: 2000, dueDate: overdueDateStr, desc: 'Venda Vencida' }
    ];

    for (const receive of receives) {
      await db.run(
        `INSERT INTO receives (customer_id, sale_id, description, amount, due_date, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [receive.customerId, receive.saleId, receive.desc, receive.amount, receive.dueDate]
      );
      console.log(`  ✓ Recebimento - R$ ${receive.amount.toFixed(2)} (${receive.desc})`);
    }

    // Pagamentos de teste
    console.log('\n📊 Criando pagamentos...');
    const payments = [
      { desc: 'Aluguel Escritório', amount: 2000, category: 'rent', dueDate: futureDateStr },
      { desc: 'Fornecedor XYZ', amount: 1500, category: 'supplier', dueDate: overdueDateStr },
      { desc: 'Contas Luz/Água', amount: 350, category: 'utility', dueDate: futureDateStr },
      { desc: 'Salário Funcionário', amount: 3000, category: 'salary', dueDate: overdueDateStr }
    ];

    for (const payment of payments) {
      await db.run(
        `INSERT INTO payments (description, amount, category, due_date, status)
         VALUES (?, ?, ?, ?, 'pending')`,
        [payment.desc, payment.amount, payment.category, payment.dueDate]
      );
      console.log(`  ✓ Pagamento - R$ ${payment.amount.toFixed(2)} (${payment.desc})`);
    }

    console.log('\n✅ Dados de teste criados com sucesso!');
    console.log('\n📋 Resumo:');
    console.log(`   - ${customers.length} Clientes`);
    console.log(`   - ${saleIds.length} Vendas`);
    console.log(`   - ${receives.length} Recebimentos`);
    console.log(`   - ${payments.length} Pagamentos`);
    console.log('\n💡 Dica: Acesse http://localhost:3000 para ver os dados!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar dados:', error);
    process.exit(1);
  }
}

// Inicializar banco de dados
db.initialize();

// Aguardar um pouco e depois popular
setTimeout(seedData, 1000);
