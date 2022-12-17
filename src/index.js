import { initializeApp } from 'firebase/app'
import { 
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, orderBy, serverTimestamp, updateDoc
} from 'firebase/firestore'
import {
    getAuth, createUserWithEmailAndPassword, signOut, 
    signInWithEmailAndPassword, onAuthStateChanged
    
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyC7DyfBKtE7Gq0RIISvKrZ4diNNZVodTWE",
    authDomain: "fir-9m-13430.firebaseapp.com",
    projectId: "fir-9m-13430",
    storageBucket: "fir-9m-13430.appspot.com",
    messagingSenderId: "1089988939227",
    appId: "1:1089988939227:web:05bce05db9dd541b066bfe",
    measurementId: "G-GK7PSCDMZQ"
};

initializeApp(firebaseConfig)
const db = getFirestore()
const auth = getAuth()

const colRef = collection(db, 'books')

const q = query(colRef, orderBy('createdAt'))

const unsubCol = onSnapshot(q, (snapshot) => {
    let books = [] 
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
    })

const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()
    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
        .then(() => {
            addBookForm.reset()
        })
})

const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const docRef = doc(db, 'books', deleteBookForm.id.value)
    deleteDoc(docRef)
        .then(() =>
        {
            deleteBookForm.reset()
        })
})

// get a single document
const docRef = doc(db, 'books', 'jIJvzaGhmlgiuzeGCVko')
const unsubDoc = onSnapshot(docRef, doc => {
        console.log(doc.data(), doc.id)
    })

const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    const docRef = doc(db, 'books', updateForm.id.value)
    
    updateDoc(docRef, {
        title: 'update title'
    })
    .then(() =>{
        updateForm.reset()
    })
}) 


const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
     console.log('user created:', cred.user)
      signupForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})

const loginForm =document.querySelector('.login')
loginForm.addEventListener('submit', (e) =>{
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) =>{
          //  console.log('user login:', cred.user)
        })
        .catch((err) =>{
            console.log(err.message)
        }) 
})

const logoutForm =document.querySelector('.logout')
logoutForm.addEventListener('click', () =>{
    signOut(auth)
        .then(() => {
          //  console.log('logout already')
        })
        .catch((err) => {
            console.log(err.message)
        })
})

const unsubAuth = onAuthStateChanged(auth, (user)=> {
console.log('user status canged:', user)
})

const unsubbutton = document.querySelector('.unsub')
unsubbutton.addEventListener(('click'), () => {
    console.log('unsubscribe')
    unsubCol()
    unsubAuth()
    unsubDoc()
})