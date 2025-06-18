const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Gateway de Productos',
            version: '1.0.0',
            description: 'Microservicio Node.js que consume la API Laravel'
        },
        servers: [
            { url: 'http://localhost:3000/api' }
        ],
        components: {
            schemas: {
                Product: {
                    type: 'object',
                    required: ['name', 'countryCode'],
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Producto México' },
                        countryCode: { type: 'string', maxLength: 2, example: 'MX' },
                        sku: { type: 'string', readOnly: true, example: 'CT-MX-1' },
                        createdAt: { type: 'string', format: 'date-time', readOnly: true },
                        updatedAt: { type: 'string', format: 'date-time', readOnly: true }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;