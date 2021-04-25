import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';

import indexRouter from './routes/index';
import authRouter from './routes/auth';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './docs/swagger';

import firebase from './services/firebase';

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
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
app.use('/auth', authRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Run Server
app.listen(port, function () {
  console.log('Express: FYP API server listening on port ' + port);
});

//Set admin user if configured
if (process.env.ADMIN_UID && process.env.ADMIN_UID.length > 0) {
  // prettier-ignore
  firebase.auth().setCustomUserClaims(process.env.ADMIN_UID, {role: 'admin'}).then(_user => {
    // Invalidate the user's current tokens as permissions may have changed
    firebase.auth().revokeRefreshTokens(process.env.ADMIN_UID).catch((err => console.error(err)))
    console.log(`Setting user ${process.env.ADMIN_UID} as admin`)
  }).catch(_err => {
    console.error(error)
  });
}
