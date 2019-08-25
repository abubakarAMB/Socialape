const functions = require('firebase-functions');

const app = require('express')();

//middleware function 
const FBAuth = require('./utils/fbAuth');
const { getAllScreams, postOneScream } = require('./handlers/screms');
const {signUp, login} = require('./handlers/users');


app.get('/screams',getAllScreams);
app.post('/scream',FBAuth, postOneScream);

//users route
app.post('/signup',signUp);
app.post('/login', login);

exports.api = functions.https.onRequest(app); 