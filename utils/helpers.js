import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { Alert } from 'react-native'

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}

export const loadImageFromGallery = async(array)=>{
    const response = { status: false, image: null }
    //const resultPermissions = await Permissions.askAsync(Permissions.CAMERA)
    const resultPermissions = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)

    if(resultPermissions.status === "denied") {
        Alert("Debes de darle permisos para acceder a las imagenes del telefono.")
        return response;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: array
    })
    if(result.cancelled){
        return response;
    }
    response.status = true
    response.image = result.uri
    return response
}

export const fileToBlob = async(path) => {
    const file = await fetch(path)
    const blod = await file.blob()
    return blod
}

export const getCurrentLocation = async() => {
    const response = { status: false, location: null }
    const resultPermissions = await Permissions.askAsync(Permissions.LOCATION)
    if(resultPermissions.status === "denied") {
        Alert.alert("Debes dar permisos para la localizacion.")
        return response
    }
    const position = await Location.getCurrentPositionAsync({})
    const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    }
    response.status = true
    response.location = location
    return response
}