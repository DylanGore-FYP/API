import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';

import indexRouter from './routes/index';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'FYP API',
    version: '0.0.0',
    description: '',
    contact: {
      name: 'Github',
      url: 'https://github.com/DylanGore/FYP-API',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js', './docs/*.yml'],
};

const swaggerSpec = swaggerJSDoc(options);

// Setup Express
const app = express();

const port = process.env.PORT || 5000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Routing
app.use('/', indexRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Run Server
app.listen(port, function () {
  console.log('Express: FYP API server listening on port ' + port);
});
