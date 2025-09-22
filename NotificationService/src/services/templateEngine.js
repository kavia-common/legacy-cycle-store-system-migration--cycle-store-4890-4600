const Handlebars = require('handlebars');

// PUBLIC_INTERFACE
function render(templateString, parameters) {
  /** Render a template string using Handlebars with provided parameters */
  try {
    const compiled = Handlebars.compile(templateString || '');
    return compiled(parameters || {});
  } catch (err) {
    throw new Error(`Template compilation error: ${err.message}`);
  }
}

module.exports = {
  render,
};
