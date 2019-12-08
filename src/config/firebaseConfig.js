import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyCpR1J0_mFpwRb9WCUIqRhZcLnPrqcQQCI",
    authDomain: "wireframer-7f8d3.firebaseapp.com",
    databaseURL: "https://wireframer-7f8d3.firebaseio.com",
    projectId: "wireframer-7f8d3",
    storageBucket: "wireframer-7f8d3.appspot.com",
    messagingSenderId: "951433345111",
    appId: "1:951433345111:web:9888ffee5a608649838b12",
    measurementId: "G-D5Q68ZBDJF"
  };
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;