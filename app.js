import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';

import defaultRouter from './routes/default';
import vehiclesRouter from './routes/vehicles';
import authRouter from './routes/auth';

import promBundle from 'express-prom-bundle';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './docs/swagger';

import firebase from './services/firebase';

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js']
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

// Prometheus Metrics
if (process.env.ENABLE_METRICS && process.env.ENABLE_METRICS.toLowerCase() === 'true') {
  app.use(promBundle({ includeMethod: true, includePath: true, includeStatusCode: true }));
}

// Routing
app.use('/', defaultRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/auth', authRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Run Server
app.listen(port, function () {
  console.log('Express: FYP API server listening on port ' + port);
});

//Set admin user if configured
if (process.env.ADMIN_UID && process.env.ADMIN_UID.length > 0 && process.env.NODE_ENV != 'test') {
  // prettier-ignore
  firebase.auth().setCustomUserClaims(process.env.ADMIN_UID, {role: 'admin'}).then(_user => {
    // Invalidate the user's current tokens as permissions may have changed
    firebase.auth().revokeRefreshTokens(process.env.ADMIN_UID).catch((err => console.error(err)))
    console.log(`Setting user ${process.env.ADMIN_UID} as admin`)
  }).catch(err => {
    console.error(err)
  });
}

export default app;
