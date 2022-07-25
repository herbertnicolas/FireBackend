import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

let firebaseConfig = {
    apiKey: "AIzaSyDn9rUSQX9njzTjuZSfMTim6KIxuHWpB0k",
    authDomain: "curso-backend-3233c.firebaseapp.com",
    projectId: "curso-backend-3233c",
    storageBucket: "curso-backend-3233c.appspot.com",
    messagingSenderId: "411632485888",
    appId: "1:411632485888:web:7075df2a26a64dacebbae5",
    measurementId: "G-YJGTQ0XRCQ"
};

// Initialize Firebase
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;