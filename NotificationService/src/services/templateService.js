const { templates } = require('../repositories/memoryStore');

/**
 * Very simple template renderer replacing {{key}} with values from params.
 * Supports type: 'email' | 'sms'. Email templates can have subject and body.
 */

// PUBLIC_INTERFACE
function renderTemplate(templateId, params = {}) {
  /** Render template by id and parameters. */
  const t = templates.get(templateId);
  if (!t) throw Object.assign(new Error('Template not found'), { status: 404 });
  const replace = (s) =>
    s.replace(/\{\{(\w+)\}\}/g, (_, key) => (params[key] !== undefined ? String(params[key]) : ''));
  const result = {
    type: t.type,
    subject: t.subject ? replace(t.subject) : undefined,
    body: t.body ? replace(t.body) : ''
  };
  return result;
}

// PUBLIC_INTERFACE
function listTemplates() {
  /** List all templates. */
  return Array.from(templates.values());
}

// PUBLIC_INTERFACE
function getTemplate(templateId) {
  /** Retrieve single template. */
  return templates.get(templateId) || null;
}

// PUBLIC_INTERFACE
function upsertTemplate(t) {
  /** Create or update a template. */
  if (!t.templateId || !t.type) {
    throw Object.assign(new Error('templateId and type are required'), { status: 400 });
  }
  templates.set(t.templateId, {
    templateId: t.templateId,
    name: t.name || t.templateId,
    subject: t.subject || '',
    body: t.body || '',
    type: t.type
  });
  return templates.get(t.templateId);
}

module.exports = { renderTemplate, listTemplates, getTemplate, upsertTemplate };
