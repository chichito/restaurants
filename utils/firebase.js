import firebase from 'firebase/app'
import 'firebase/firestore'



 // Your web app's Firebase configuration
 const firebaseConfig = {
    apiKey: "AIzaSyAVca4zFVJUvj9Rta8VPJeHJjrhqQume2s",
    authDomain: "restaurants-3682f.firebaseapp.com",
    projectId: "restaurants-3682f",
    storageBucket: "restaurants-3682f.appspot.com",
    messagingSenderId: "767055819396",
    appId: "1:767055819396:web:223e419747f1efebb308d1"
  };
  // Initialize Firebase
  export const firebaseApp = firebase.initializeApp(firebaseConfig);