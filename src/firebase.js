import firebase from "firebase/app"

var firebaseConfig = {
    apiKey: "AIzaSyAV_lm-m49nT1uaXBzwBwZsXzsV16ZmdiI",
    authDomain: "wealth-of-nations.firebaseapp.com",
    databaseURL: "https://wealth-of-nations-default-rtdb.firebaseio.com",
    projectId: "wealth-of-nations",
    storageBucket: "wealth-of-nations.appspot.com",
    messagingSenderId: "585602058367",
    appId: "1:585602058367:web:2d7e2915b43f466e57d74a",
    measurementId: "G-LWK0DJPE26"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export const database = firebase.database()
