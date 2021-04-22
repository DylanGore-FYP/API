import * as admin from 'firebase-admin';
import credentials from '../serviceAccountKey.json';

// Initialise the firebase instance using a credentials JSON file
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

export default admin;
