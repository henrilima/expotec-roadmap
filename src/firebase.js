const firebase = require("firebase");
const bancodedados = require("shorten-firebase.realtime-database");

const firebaseConfig = { /* FIREBASE CONFIG */ };

try {
    firebase.initializeApp(firebaseConfig);
    console.log("DATABASE IS ON!");
} catch (err) {
    console.log(err);
}
const database = new bancodedados(firebase, false);

module.exports = {
    database,
    firebase,
};