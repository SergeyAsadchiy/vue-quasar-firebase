// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

const dbType = !window.location.href.includes('production-domain-name') ? 'dev' : 'prod'

let firebaseConfig
switch (dbType) {
  case 'prod':
    firebaseConfig = {
      apiKey: 'xxx',
      authDomain: 'xxx',
      projectId: 'xxx',
      storageBucket: 'xxx',
      messagingSenderId: 'xxx',
      appId: 'xxx',
      measurementId: 'xxx'
    }
    break
  case 'dev':
    firebaseConfig = {
      apiKey: "AIzaSyB__MDmNA_6zmHRauMQlBez3cCRDw1TAv4",
      authDomain: "quasar-chat-6688d.firebaseapp.com",
      projectId: "quasar-chat-6688d",
      storageBucket: "quasar-chat-6688d.appspot.com",
      messagingSenderId: "243422691215",
      appId: "1:243422691215:web:cfaedf72db2cae4c9015fa"
    }
    break
  default:
    console.log('No database connection!')
}

let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth();
let firebaseDB = firebaseApp.database();

export { firebaseAuth, firebaseDB }

