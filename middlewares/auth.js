import e from 'express';
import firebase from '../services/firebase';

// Middleware to handle authentication with a Firebase user token
export const authMiddleware = (request, response, next) => {
  // Get the authorization header from the request
  const authHeader = request.headers.authorization;
  // Ensure the token is present
  if (!authHeader) {
    return response.status(401).send({ message: 'You are not authorized to access this resource', reason: 'No token provided' });
  } else {
    // Ensure the header is valid (It should look something like 'Authorization xxxxxxx')
    if (authHeader && authHeader.split(' ')[0] !== 'Bearer') {
      response.status(401).send({ message: 'You are not authorized to access this resource', reason: 'Invalid token' });
    } else {
      const authToken = authHeader.split(' ')[1];
      // Verify the token using Firebase, if it's valid, continue, else return a 403 error
      // prettier-ignore
      firebase.auth().verifyIdToken(authToken).then(() => next()).catch(() => {
        response.status(403).send({ message: 'Forbidden' })
      });
    }
  }
};

export const authAdminMiddleware = (request, response, next) => {
  // Get the authorization header from the request
  const authHeader = request.headers.authorization;
  // Ensure the token is present
  if (!authHeader) {
    return response.status(401).send({ message: 'You are not authorized to access this resource', reason: 'No token provided' });
  } else {
    // Ensure the header is valid (It should look something like 'Authorization xxxxxxx')
    if (authHeader && authHeader.split(' ')[0] !== 'Bearer') {
      response.status(401).send({ message: 'You are not authorized to access this resource', reason: 'Invalid token' });
    } else {
      const authToken = authHeader.split(' ')[1];
      // Verify the token using Firebase, if it's valid, continue, else return a 403 error
      // prettier-ignore
      firebase.auth().verifyIdToken(authToken).then((decodedToken) => {
        if (decodedToken.role === 'admin'){
          next()
        }else{
          console.log('unauth', decodedToken)
          response.status(401).send({ message: 'You are not authorized to access this resource', reason: 'Insufficient permissions' });
        }
      }).catch(() => {
        response.status(403).send({ message: 'Forbidden' })
      });
    }
  }
};
