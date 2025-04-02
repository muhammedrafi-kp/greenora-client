// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2yAsNzVJiwiuarlSdYp7cIriVHpRfpMk",
  authDomain: "greenora-308e2.firebaseapp.com",
  projectId: "greenora-308e2",
  storageBucket: "greenora-308e2.firebasestorage.app",
  messagingSenderId: "557966493854",
  appId: "1:557966493854:web:9ece91aa76cdb15eb2538f",
  measurementId: "G-4CJFY8DJGH"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging, getToken, onMessage };


// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "your-app.firebaseapp.com",
//   projectId: "your-project-id",
//   storageBucket: "your-app.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const messaging = getMessaging(firebaseApp);

// export { messaging, getToken, onMessage };
