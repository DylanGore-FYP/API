import firebase from '../services/firebase';

// Middleware to handle authentication with a Firebase user token
export const authMiddleware = (request, response, next) => {
  // Get the authorization header from the request
  const authHeader = request.headers.authorization;
  // Ensure the token is present
  if (!authHeader) {
    return response.send({ message: 'You are not authorized to access this resource', reason: 'No token provided' }).status(401);
  } else {
    // Ensure the header is valid (It should look something like 'Authorization xxxxxxx')
    if (authHeader && authHeader.split(' ')[0] !== 'Bearer') {
      response.send({ message: 'You are not authorized to access this resource', reason: 'Invalid token' }).status(401);
    } else {
      const authToken = authHeader.split(' ')[1];
      // Verify the token using Firebase, if it's valid, continue, else return a 403 error
      // prettier-ignore
      firebase.auth().verifyIdToken(authToken).then(() => next()).catch(() => {
        response.send({ message: 'Forbidden' }).status(403)
      });
    }
  }
};
