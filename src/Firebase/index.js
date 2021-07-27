import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAQbf7lHgOLMPK8f7BmVfdSFF6EbqMD4g",
  authDomain: "checking-test-3e642.firebaseapp.com",
  databaseURL: "https://checking-test-3e642.firebaseio.com",
  projectId: "checking-test-3e642",
  storageBucket: "checking-test-3e642.appspot.com",
  messagingSenderId: "336895940035",
  appId: "1:336895940035:web:2ca602d4a90865ac9bd976",
  measurementId: "G-CW49JDBMEG",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
