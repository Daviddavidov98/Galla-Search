import firebase from 'firebase/app'
import "firebase/storage"
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyB17bXv_NDsuLVpAUlBHK9xN8Rjb0L62gw",
    authDomain: "img-searcher-project.firebaseapp.com",
    databaseURL: "https://img-searcher-project.firebaseio.com",
    projectId: "img-searcher-project",
    storageBucket: "img-searcher-project.appspot.com",
    messagingSenderId: "239578441825",
    appId: "1:239578441825:web:9e6e776db5ba5072432220"
  };
  // Initialize Firebase
  export const app = firebase.initializeApp(firebaseConfig);
