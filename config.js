import * as firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyB0Tf90ek7TxtnKF8EDRNl5HK3b-gvTQVY",
  authDomain: "book-santa-3deb7.firebaseapp.com",
  databaseURL: "https://book-santa-3deb7.firebaseio.com",
  projectId: "book-santa-3deb7",
  storageBucket: "book-santa-3deb7.appspot.com",
  messagingSenderId: "289567321560",
  appId: "1:289567321560:web:befe4df8d0fef30f3796ad",
  measurementId: "G-9D40648F8K",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();
export default firebase.firestore();
