const fs = require('fs');
const path = require('path');

const templatesBaseDir = path.join(__dirname, '..', 'templates');

// Some default templates in case files are missing
const defaultTemplates = {
  email: {
    welcome: {
      subject: 'Welcome, {{name}}!',
      body: '<p>Hello {{name}},</p><p>Welcome to Cycle Store! We are glad to have you.</p>',
    },
  },
  sms: {
    otp: {
      body: 'Your verification code is {{code}}. It expires in {{minutes}} minutes.',
    },
  },
};

// PUBLIC_INTERFACE
async function getTemplate(type, templateId) {
  /** Return a template object: { subject?: string, body: string } for email or sms */
  const safeType = (type || '').toLowerCase();
  const safeId = templateId || '';
  const dir = path.join(templatesBaseDir, safeType);
  const filePath = path.join(dir, `${safeId}.hbs`);

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Simple convention: if email, allow subject line as first comment like {{! subject: Subject text }}
      if (safeType === 'email') {
        const subjectMatch = content.match(/\{\{!\s*subject:\s*([^\}]+)\}\}/i);
        const subject = subjectMatch ? subjectMatch[1].trim() : undefined;
        const body = content.replace(/\{\{!\s*subject:[^\}]+\}\}\s*/i, '');
        return { subject, body };
      }
      return { body: content };
    }
    // Fallback to defaults
    const defaults = defaultTemplates[safeType] && defaultTemplates[safeType][safeId];
    if (defaults) return defaults;
    // Ultimate fallback
    return { body: 'Hello {{name}}, this is a notification.' };
  } catch (err) {
    throw new Error(`Failed to load template: ${err.message}`);
  }
}

module.exports = {
  getTemplate,
};
