'use strict';

const DEFAULT_TEMPLATES = [
  { templateId: 'welcome_email', name: 'Welcome Email', subject: 'Welcome, {{name}}!', body: 'Hello {{name}}, thanks for joining CycleStore.', type: 'email' },
  { templateId: 'order_sms', name: 'Order SMS', subject: '', body: 'Hi {{name}}, your order {{orderId}} is confirmed.', type: 'sms' },
];

function interpolate(str, params = {}) {
  return (str || '').replace(/\{\{(\w+)\}\}/g, (_, k) => (params[k] != null ? String(params[k]) : ''));
}

class TemplateService {
  constructor() {
    this._templates = new Map(DEFAULT_TEMPLATES.map(t => [t.templateId, t]));
  }

  // PUBLIC_INTERFACE
  list() {
    /** List templates. */
    return Array.from(this._templates.values());
  }

  // PUBLIC_INTERFACE
  get(templateId) {
    /** Get template by id. */
    return this._templates.get(templateId) || null;
  }

  // PUBLIC_INTERFACE
  upsert(template) {
    /** Create/update a template. */
    if (!template || !template.templateId || !template.type) {
      throw new Error('Invalid template');
    }
    this._templates.set(template.templateId, template);
    return template;
  }

  // PUBLIC_INTERFACE
  render(templateId, params) {
    /** Render template with parameters. */
    const t = this.get(templateId);
    if (!t) throw new Error('TemplateNotFound');
    return {
      subject: interpolate(t.subject, params),
      body: interpolate(t.body, params),
      type: t.type,
    };
  }
}

module.exports = new TemplateService();
