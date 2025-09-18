const { upsertTemplate } = require('../services/templateService');
const logger = require('../utils/logger');

function seed() {
  try {
    upsertTemplate({
      templateId: 'welcome_email',
      name: 'Welcome Email',
      subject: 'Welcome, {{name}}!',
      body: '<p>Hello {{name}}, welcome to Cycle Store.</p>',
      type: 'email'
    });
    upsertTemplate({
      templateId: 'order_sms',
      name: 'Order SMS',
      body: 'Hi {{name}}, your order {{orderId}} is confirmed.',
      type: 'sms'
    });
    logger.info('Seeded default templates');
  } catch (e) {
    logger.warn('Seeding failed or skipped: %s', e.message);
  }
}

module.exports = { seed };
