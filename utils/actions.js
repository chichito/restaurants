import { firebaseApp } from './firebase'
import { FireSQL } from 'firesql'
import * as firebase from 'firebase'
import 'firebase/firestore'
import { fileToBlob } from './helpers'
import { map } from 'lodash'

const db = firebase.firestore(firebaseApp)
const fireSQL = new fireSQL(firebase.firestore(), { includeId: "id" })

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

export const updateDocument = async(collection, id, data) => {
    const result = { statusResponse: true, error: null }

    try {
        await db.collection(collection).doc(id).update(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }

    return result
}

export const getRestaurantReviews = async(id) => {
    const result = { statusResponse: true, error: null, reviews: [] }
    console.log(id)
    try {
        const response = await db
        .collection("reviews")
        .where("idRestaurant", "==", id)
        //.orderBy("createAt","desc")
        .get()
        response.forEach((doc) => {
            const review = doc.data() 
            review.id = doc.id
            result.reviews.push(review)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }

    return result
}

export const getIsFavorite = async( idRestaurant ) => {
    const result = { statusResponse: true, error: null, isFavorite: false }

    try {
        const response = await db.collection("favorites")
                                .where("idRestaurant","==",idRestaurant)
                                .where("idUser","==",getCurrecntUser().uid)
                                .get()
        result.isFavorite = response.docs.length > 0
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }

    return result
}

export const deleteFavorite = async( idRestaurant ) => {
    const result = { statusResponse: true, error: null }

    try {
        const response = await db.collection("favorites")
                                .where("idRestaurant","==",idRestaurant)
                                .where("idUser","==",getCurrecntUser().uid)
                                .get()
        response.forEach(async(doc) => {
            const favoriteId = doc.id
            await db.collection("favorites").doc(favoriteId).delete()
        })
    } catch (error) {
        result.error = error
    }

    return result
}

export const getFavorite = async( idRestaurant ) => {
    const result = { statusResponse: true, error: null, favorites: [] }

    try {
        const response = await db.collection("favorites")
                                .where("idUser","==",getCurrecntUser().uid)
                                .get()
        await Promise.all(
            map(response.docs, async(doc) =>{
                const favorite = doc.data()
                const restaurant = await getDocumentById("restaurants", favorite.idRestaurant)
                if(restaurant.statusResponse){
                    result.favorites.push(restaurant.document)
                }
            })
        )
    } catch (error) {
        result.error = error
    }

    return result
}

export const getToRestaurants = async( limit ) => {
    const result = { statusResponse: true, error: null, restaurants: [] }

    try {
        const response = await db.collection("restaurants")
                                .orderBy("rating", "desc")
                                .limit(limit)
                                .get()
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

export const formaPhone = (callingCode, phone) => {
    return `+(${callingCode}) ${phone.substr(0,3)} ${phone.substr(3,3)} ${phone.substr(6,6)}`
}