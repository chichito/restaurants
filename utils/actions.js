import { firebaseApp } from './firebase'
import * as firebase from 'firebase'
import 'firebase/firestore'
import { fileToBlob } from './helpers'

const db = firebase.firestore(firebaseApp)

export const isUserLogged = () => {
    let isLogged = false
    firebase.auth().onAuthStateChanged((user) => {
        user !== null && (isLogged = true)
    })
    return isLogged
}

export const getCurrecntUser = () => {
    return firebase.auth().currentUser
}

export const closeSession = () => {
    return firebase.auth().signOut()
}

export const registrerUser = async(email, password) =>{
    const result = { statusResponse: true, error: null}

    try {
        await firebase.auth().createUserWithEmailAndPassword(email,password)
    } catch (error) {
        result.error = "Este correo ya ha sido registrado."
        result.statusResponse = false
    }
    return result
}

export const loginWithEmailAndPassword = async(email, password) =>{
    const result = { statusResponse: true, error: null}

    try {
        await firebase.auth().signInWithEmailAndPassword(email,password)
    } catch (error) {
        result.error = "Usuario o Contraseña no validos."
        result.statusResponse = false
    }
    return result
}

export const uploadImage = async(image, path, name) => {
    const result = { statusResponse: false, error: null, url: null}
    const ref = firebase.storage().ref(path).child(name)
    const blod = await fileToBlob(image)

    try {
        await ref.put(blod)
        const url = await firebase.storage().ref(`${path}/${name}`).getDownloadURL()
        result.statusResponse = true
        result.url = url
    } catch (error) {
        result.error = error;
    }
    return result
}

export const updateProfile = async(data) => {
    const result = { statusResponse: true, error: null }

    try {
        await firebase.auth().currentUser.updateProfile(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }

    return result
}

export const reauthenticate = async(password) => {
    const result = { statusResponse: true, error: null }
    const user = getCurrecntUser()
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, password)

    try {
        await user.reauthenticateWithCredential(credentials)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }

    return result
}

export const updateEmail = async(email) => {
    const result = { statusResponse: true, error: null }

    try {
        await firebase.auth().currentUser.updateEmail(email)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }

    return result
}

export const updatePassword = async(password) => {
    const result = { statusResponse: true, error: null }

    try {
        await firebase.auth().currentUser.updatePassword(password)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }

    return result
}

export const addDocumentWithoutId = async(collection, data) => {
    const result = { statusResponse: true, error: null }

    try {
        await db.collection(collection).add(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }

    return result
}

export const getRestaurants = async(limitRestaurants) => {
    const result = { statusResponse: true, error: null, restaurants: [], startRestaurant: null }

    try {
        const response = await db
        .collection("restaurants")
        .orderBy("createAt","desc")
        .limit(limitRestaurants).get()
        if (response.docs.length > 0){
            result.startRestaurant = response.docs[response.docs.length-1]
        }
        response.forEach((doc) => {
            const restaurant = doc.data() 
            restaurant.id = doc.id
            result.restaurants.push(restaurant)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }

    return result
}

export const getMoreRestaurants = async(limitRestaurants,startRestaurants) => {
    const result = { statusResponse: true, error: null, restaurants: [], startRestaurant: null }

    try {
        const response = await db
        .collection("restaurants")
        .orderBy("createAt","desc")
        .startAfter(startRestaurants.data().createAt)
        .limit(limitRestaurants).get()
        if (response.docs.length > 0){
            result.startRestaurant = response.docs[response.docs.length-1]
        }
        response.forEach((doc) => {
            const restaurant = doc.data() 
            restaurant.id = doc.id
            result.restaurants.push(restaurant)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }

    return result
}

export const getDocumentById = async(collection, id) => {
    const result = { statusResponse: true, error: null, document: null }

    try {
        const response = await db.collection(collection).doc(id).get()
        result.document = response.data()
        result.document.id = response.id
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }

    return result
}


export const formaPhone = (callingCode, phone) => {
    return `+(${callingCode}) ${phone.substr(0,3)} ${phone.substr(3,3)} ${phone.substr(6,6)}`
}