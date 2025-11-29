// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgk71QjYn77whpeXe-V5gzRP2udTnM3NE",
    authDomain: "flipboard-system.firebaseapp.com",
    projectId: "flipboard-system",
    storageBucket: "flipboard-system.firebasestorage.app",
    messagingSenderId: "800049012794",
    appId: "1:800049012794:web:d6696de3bb477133359503"
};

// Initiera Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
