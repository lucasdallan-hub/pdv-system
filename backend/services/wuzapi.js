const axios = require('axios');

const WUZAPI_BASE_URL = process.env.WUZAPI_URL || 'https://api.nxsplus.xyz';
const WUZAPI_TOKEN = process.env.WUZAPI_TOKEN;
const WUZAPI_INSTANCE = process.env.WUZAPI_INSTANCE;

const WuzAPI = {
  /**
   * Envia mensagem WhatsApp via Wuzapi
   * @param {string} phone - Número do telefone (com código do país)
   * @param {string} message - Mensagem a enviar
   * @returns {Promise}
   */
  sendMessage: async function(phone, message) {
    try {
      if (!WUZAPI_TOKEN || !WUZAPI_INSTANCE) {
        console.warn('⚠️ Wuzapi credentials not configured');
        return { success: false, error: 'Wuzapi not configured' };
      }

      const payload = {
        phone: phone,
        message: message
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${WUZAPI_TOKEN}`,
          'Content-Type': 'application/json'
        }
      };

      // Endpoint típico da Wuzapi para enviar mensagens
      const response = await axios.post(
        `${WUZAPI_BASE_URL}/api/send-message/${WUZAPI_INSTANCE}`,
        payload,
        config
      );

      console.log('✅ WhatsApp message sent successfully:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error sending WhatsApp message:', error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * Envia mensagem de cobrança formatada
   */
  sendCollectionNotice: async function(phone, customerName, amount, dueDate) {
    const message = `
🔔 *COBRANÇA* 🔔

Olá ${customerName}!

Você tem um pendência de pagamento:
💰 Valor: R$ ${amount.toFixed(2)}
📅 Vencimento: ${dueDate}

Por favor, efetue o pagamento o quanto antes.

Dúvidas? Entre em contato conosco!
    `.trim();

    return this.sendMessage(phone, message);
  },

  /**
   * Envia comprovante de recebimento
   */
  sendReceiptConfirmation: async function(phone, customerName, amount, saleId) {
    const message = `
✅ *COMPROVANTE DE RECEBIMENTO* ✅

Olá ${customerName}!

Recebimento confirmado com sucesso!
💰 Valor: R$ ${amount.toFixed(2)}
📋 Número do pedido: #${saleId}
⏰ Data: ${new Date().toLocaleDateString('pt-BR')}

Obrigado pela preferência!
    `.trim();

    return this.sendMessage(phone, message);
  },

  /**
   * Envia notificação de pagamento vencido
   */
  sendOverdueNotice: async function(phone, customerName, amount, daysOverdue) {
    const message = `
⚠️ *AVISO IMPORTANTE* ⚠️

Olá ${customerName}!

Sua fatura está vencida há ${daysOverdue} dias!
💰 Valor em aberto: R$ ${amount.toFixed(2)}

Por favor, regularize sua situação o quanto antes.
Evite juros e multa!

Clique aqui para pagar: [link_pagamento]
    `.trim();

    return this.sendMessage(phone, message);
  },

  /**
   * Verifica status de instância Wuzapi
   */
  checkStatus: async function() {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${WUZAPI_TOKEN}`
        }
      };

      const response = await axios.get(
        `${WUZAPI_BASE_URL}/api/instances/${WUZAPI_INSTANCE}`,
        config
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error checking Wuzapi status:', error.message);
      return { success: false, error: error.message };
    }
  }
};

module.exports = WuzAPI;
