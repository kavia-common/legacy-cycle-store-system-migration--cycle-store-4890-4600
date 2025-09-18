const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const { notFound } = require('./middleware/errorHandler');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', true);
app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGINS || '*'),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
  };
  swaggerUi.setup(dynamicSpec, { explorer: true })(req, res, next);
});

// Routes
app.use('/', routes);

// 404 and error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
