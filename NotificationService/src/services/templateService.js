'use strict';

// Default templates for common notifications
const DEFAULT_TEMPLATES = [
  { 
    templateId: 'welcome_email',
    name: 'Welcome Email',
    subject: 'Welcome to CycleStore, {{name}}!',
    body: 'Hello {{name}},\n\nThank you for joining CycleStore. We\'re excited to have you as part of our cycling community!\n\nBest regards,\nThe CycleStore Team',
    type: 'email'
  },
  {
    templateId: 'order_confirmation_email',
    name: 'Order Confirmation',
    subject: 'Your CycleStore Order #{{orderId}} is Confirmed',
    body: 'Hello {{name}},\n\nThank you for your order #{{orderId}}. We\'ll notify you when your items have shipped.\n\nOrder Total: ${{total}}\n\nBest regards,\nThe CycleStore Team',
    type: 'email'
  },
  {
    templateId: 'order_shipped_sms',
    name: 'Order Shipped SMS',
    subject: '',
    body: 'CycleStore: Your order #{{orderId}} has shipped! Track it here: {{trackingUrl}}',
    type: 'sms'
  }
];

/**
 * Template interpolation helper
 */
function interpolate(str = '', params = {}) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key] != null ? String(params[key]) : '';
  });
}

/**
 * Service for managing and rendering notification templates
 */
class TemplateService {
  constructor() {
    this._templates = new Map(DEFAULT_TEMPLATES.map(t => [t.templateId, t]));
  }

  /**
   * PUBLIC_INTERFACE
   * List all available templates
   * @returns {Array<Object>} List of templates
   */
  list() {
    return Array.from(this._templates.values());
  }

  /**
   * PUBLIC_INTERFACE
   * Get template by ID
   * @param {string} templateId Template identifier
   * @returns {Object|null} Template if found
   */
  get(templateId) {
    return this._templates.get(templateId) || null;
  }

  /**
   * PUBLIC_INTERFACE
   * Create or update a template
   * @param {Object} template Template object
   * @returns {Object} Saved template
   */
  upsert(template) {
    if (!template?.templateId || !template?.type) {
      throw new Error('Invalid template: templateId and type required');
    }
    
    const existing = this._templates.get(template.templateId);
    const merged = { ...existing, ...template };
    this._templates.set(template.templateId, merged);
    return merged;
  }

  /**
   * PUBLIC_INTERFACE
   * Render a template with parameters
   * @param {string} templateId Template to render
   * @param {Object} params Parameters for interpolation
   * @returns {Object} Rendered subject and body
   */
  render(templateId, params = {}) {
    const template = this.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    return {
      subject: interpolate(template.subject, params),
      body: interpolate(template.body, params),
      type: template.type
    };
  }
}

module.exports = new TemplateService();
