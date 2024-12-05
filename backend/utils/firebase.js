// Import using CommonJS require syntax
var admin = require("firebase-admin");



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const serviceAccount = require('../config.json');

// Initialize Firebase
app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: serviceAccount.databaseURL
  });
const db = admin.database();
module.exports = { app, db };

// Export using CommonJS syntax
// module.exports = { app, db };
