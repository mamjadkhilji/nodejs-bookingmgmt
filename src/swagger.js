const swaggerJSDoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || 'localhost';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Booking Management API',
      version: '1.0.0',
      description: 'API documentation for the Booking Management system',
    },
    servers: [
      { url: `http://${HOST}:${PORT}` }
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs (adjust if needed)
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;