// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc, deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCk_cvKIHnoZYdL2TGgVk5Lptce5p_AQeI",
  authDomain: "todo-app-6969.firebaseapp.com",
  projectId: "todo-app-6969",
  storageBucket: "todo-app-6969.appspot.com",
  messagingSenderId: "841955263241",
  appId: "1:841955263241:web:48f0356ea13b838019c9d8",
  measurementId: "G-LTJ48Z91FB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signupButton = document.querySelector("#sButton");
const signupEmail = document.querySelector("#sEmail");
const signupPassword = document.querySelector("#sPass");
const popup = document.querySelector(".popup");
const closemodal = document.querySelector(".close-modal")
const closemodal2 = document.querySelector(".close-modal2")
const errormessage = document.querySelector(".error")

if (signupButton) {
  signupButton.addEventListener("click", function () {
    event.preventDefault();
    closemodal.addEventListener("click", function() {
        popup.classList.add("hidden")
    })
    closemodal2.addEventListener("click", function(){
        errormessage.classList.add("hidden2")
    })
    createUserWithEmailAndPassword(
      auth,
      signupEmail.value,
      signupPassword.value
    )
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.email);
        console.log(user.uid);
        popup.classList.remove("hidden");
       
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error code ==> ", errorCode);
        console.log("error message ==> ", errorMessage);
        errormessage.classList.remove("hidden2");
      });
  });
}

const loginButton = document.querySelector("#LButton");
const loginEmail = document.querySelector("#LEmail");
const loginPassword = document.querySelector("#LPass");

if (loginButton) {
loginButton.addEventListener("click", function () {
    event.preventDefault();
  signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user.email);
      console.log(user.uid);
      window.location.assign("Todo.html");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error code ==> ", errorCode);
      console.log("error message ==> ", errorMessage);
    });
});
}

// FireStore
const getADD = document.querySelector("#gettodo");
const getinp = document.querySelector("#getInp");
const getpopup = document.querySelector(".popup3")
const closemodal3 = document.querySelector(".close-modal2")

getADD.addEventListener("click", async function () {
    getpopup.classList.remove("hidden3")
    getpopup.addEventListener("click", function () {
        getpopup.classList.add("hidden3")
    })
    const docRef = await addDoc(collection(db, "todos"), {
      name: getinp.value,
      time: new Date().toLocaleString(),
    });
    console.log("Document written with ID: ", docRef.id);
  });

// Now we have to clean the data:

const ids = [];

function getDATA() {
    let getUL = document.querySelector("#getUL");

    onSnapshot(collection(db, "todos"), (Data) => {
        Data.docChanges().forEach( (newdata) => {
            ids.push(newdata.doc.id);

            if (newdata.type == 'removed') {
                let del = document.getElementById(newdata.doc.id);
                del.remove();
            }
            else if (newdata.type == 'added'){
            // console.log(newdata.type);
            getUL.innerHTML +=
            `<li id='${newdata.doc.id}' > ${newdata.doc.data().name} <br> ${newdata.doc.data().time} <button onclick='deltodo("${newdata.doc.id}")' class='delete' > Delete </button> 
            <button onclick="edit(this, '${newdata.doc.id}')" class='edit' > Edit </button> </li> <br> `
            }
        })
    })
}
getDATA();
window.getDATA = getDATA

// Delete Elements:

async function deltodo(id) {
    await deleteDoc(doc(db, "todos", id));
}

window.deltodo = deltodo

// Deleting All Elements:

async function delAll() {
    getUL.innerHTML = '';
    for (var i = 0; i < ids.length; i++){
        await deleteDoc(doc(db, 'todos', ids[i]));
    }
}

window.delAll = delAll;

// Edit Elements:

async function edit(e, id) {
    let editval = prompt("Enter Edit Value");

    e.parentNode.firstChild.nodeValue = editval;
    console.log(e.parentNode.firstChild);
    
    await updateDoc(doc(db, "todos", id), {
      name: editval,
      time: new Date().toLocaleString(),
    });
}

window.edit = edit

// Mouse Seeking

//Selecting the eye div
let eye_ref = document.querySelectorAll(".eye");
//mousemove for devices with mouse aand touchmove for touchcreen devices
let events = ["mousemove", "touchmove"];
//Check for touch screen
function isTouchDevice() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}
//Same function for both events
events.forEach((eventType) => {
  document.body.addEventListener(eventType, (event) => {
    eye_ref.forEach((eye) => {
      /* getBoundingClientRect() method returns the position relative to the viewport */
      let eyeX = eye.getBoundingClientRect().left + eye.clientWidth / 2;
      let eyeY = eye.getBoundingClientRect().top + eye.clientHeight / 2;
      /* ClientX and ClientY return the position of clients cursor from top left of the screen*/
      var x = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
      var y = !isTouchDevice() ? event.clientY : event.touches[0].clientY;
      /* 
    Subtract x position of mouse from x position of eye and y position of mouse from y position of eye.
    Use atan2(returns angle in radians)
    */
      let radian = Math.atan2(x - eyeX, y - eyeY);
      //Convert Radians to Degrees
      let rotationDegrees = radian * (180 / Math.PI) * -1 + 180;
      //Rotate the eye
      eye.style.transform = "rotate(" + rotationDegrees + "deg)";
    });
  });
});