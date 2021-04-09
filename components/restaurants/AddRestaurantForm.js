import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Alert, Dimensions } from 'react-native'
import { Avatar, Button, Icon, Input,Image } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'
import { map, size, filter, isEmpty } from 'lodash'
import { getCurrentLocation, loadImageFromGallery, validateEmail } from '../../utils/helpers'
import Modal from '../../components/Modal'
import MapView from 'react-native-maps'
import { addDocumentWithoutId, getCurrecntUser, uploadImage } from '../../utils/actions'
import uuid from 'random-uuid-v4'

const widthScreen=Dimensions.get("window").width

export default function AddRestaurantForm({ toastRef, setLoading, navigation }) {

    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationRestaurant, setLocationRestaurant] = useState(null)

    const addRestaurant = async() => {
        if(validForm()){
            return
        }

        setLoading(true)
        const responseUploadImages = await uploadImages()
        console.log(responseUploadImages)
        const restaurant = {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            descripcion: formData.descripcion,
            phone: formData.phone,
            callingCode: formData.callingCode,
            location: locationRestaurant,
            images: responseUploadImages,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: getCurrecntUser().uid
        }
        const responseAddDocument = await addDocumentWithoutId("restaurants",restaurant)
        setLoading(false)
        console.log(responseAddDocument)
        console.log(restaurant)

        if(!responseAddDocument.statusResponse){
            toastRef.current.show("Error al grabar el restaurant, por favor intentar mas tarde")
            return
        }

        navigation.navigate("restaurants")
    }

    const uploadImages = async() => {
        const imagesUrl = []
        await Promise.all(
            map(imagesSelected, async(image) => {
                const response = await uploadImage(image, "restaurants", uuid())
                if(response.statusResponse){
                    imagesUrl.push(response.url)
                }
            })
        )
        return imagesUrl
    }

    const validForm = () => {
        clearErrors()
        let isValid = false

        if (isEmpty(formData.name)){
            setErrorName("Debes Ingresar un nombre del restaurant.")
            isValid = true
        }
        if (isEmpty(formData.address)){
            setErrorAddress("Debes Ingresar una direccion del restaurant.")
            isValid = true
        }
        if (size(formData.phone) < 10 ){
            setErrorPhone("Debes Ingresar un telefono de restaurant valido.")
            isValid = true
        }
        if(!validateEmail(formData.email)){
            setErrorEmail("Debes Ingresar un email del restaurant valido.")
            isValid = true
        }
        if (isEmpty(formData.descripcion)){
            setErrorDescription("Debes Ingresar una descripcion del restaurant.")
            isValid = true
        }
        if (!locationRestaurant){
            toastRef.current.show("Debes de localizar del restaurant.",3000)
            isValid = true
        } else if(size(imagesSelected) === 0 ){
            toastRef.current.show("Debes ingresar por lo menos una imagen del restaurant.",3000)
            isValid = true
        }

        return isValid
    }

    const clearErrors = () => {
        setErrorName(null)
        setErrorAddress(null)
        setErrorDescription(null)
        setErrorEmail(null)
        setErrorPhone(null)
    }

    return (
        <ScrollView style={styles.viewContainer}>
            <ImageRestaurant
                imageRestaurant={imagesSelected[0]}
            />
            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorName={errorName}
                errorDescription={errorDescription}
                errorEmail={errorEmail}
                errorAddress={errorAddress}
                errorPhone={errorPhone}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                title="Crear Restaurate"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <MapRestaurant
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap} 
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}



function MapRestaurant({ isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef }){
    const [newRegion, setNewRegion] = useState(null)
    useEffect(() => {
        (async() => {
            const response = await getCurrentLocation()
            if(response.status){
                setNewRegion(response.location)
                //console.log(response.location)
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(newRegion)
        toastRef.current.show("Localizacion guardada correctamente",3000)
        setIsVisibleMap(false)
    }

    return (
        <Modal
            isVisible={isVisibleMap}
            setVisible={setIsVisibleMap}
        >
            <View>
                {
                    newRegion && (
                        <MapView
                            style={styles.mapStyle}
                            initialRegion={newRegion}
                            showsUserLocation={true}
                            onRegionChange={(region) => setNewRegion(region)}
                        >
                            <MapView.Marker
                                coordinate = {{
                                    latitude: newRegion.latitude,
                                    longitude: newRegion.longitude
                                }}
                                draggable
                            />
                        </MapView>
                    )
                }
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar Ubicacion"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button
                        title="Cancelar Ubicacion"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function ImageRestaurant({ imageRestaurant }){
    return (
        <View style={styles.viewPhoto}>
            <Image
                style={{ width: widthScreen, height: 200 }}
                source={
                    imageRestaurant 
                        ? { uri: imageRestaurant }
                        : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected }){

    const imageSelect = async() => {
        const response = await loadImageFromGallery([4, 3])
        if(!response.status){
            toastRef.current.show("No has seleccionado ninguna imagen.",3000)
            return
        }
        setImagesSelected([...imagesSelected, response.image])
    }

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "Deseas seguro que quieres eliminar la imagen?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Si",
                    onPress: () => {
                        setImagesSelected(
                            filter(imagesSelected,(imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ],
            {
                cancelable: true
            }
        )
    }

    return(
        <ScrollView
            horizontal
            style={styles.viewImages}
        >
            {
                size(imagesSelected) < 10 && (
                    <Icon
                        type="material-community"
                        name="camera"
                        color="#7a7a7a"
                        containerStyle={styles.containerIcon}
                        onPress={imageSelect}
                    />
                )
            }       
            {
                map(imagesSelected, (imageRestaurant, index) => (
                    <Avatar
                        key={index}
                        style={styles.minuatureStyle}
                        source={{ uri: imageRestaurant }}
                        onPress={() => removeImage(imageRestaurant)}
                    />
                ))
            }    
        </ScrollView>
    )
}

function FormAdd({ 
    formData, 
    setFormData, 
    errorName, 
    errorDescription, 
    errorEmail, 
    errorAddress, 
    errorPhone, 
    setIsVisibleMap,
    locationRestaurant
 }){
    const [country, setCountry] = useState("EC")
    const [callingCode, setCallingCode] = useState("593")
    const [phone, setPhone] = useState("")
    
    const onChange = (e,type) => {
        setFormData({ ...formData, [type] : e.nativeEvent.text })
    }

    return(
        <View style={styles.viewForm}>
            <Input 
                placeholder="Nombre del restaurant"
                defaultValue={formData.name}
                onChange={(e) => onChange(e,"name")}
                errorMessage={errorName}
            />
            <Input 
                placeholder="Direccion del restaurant"
                defaultValue={formData.address}
                onChange={(e) => onChange(e,"address")}
                errorMessage={errorAddress}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#442484" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input 
                keyboardType="email-address"
                placeholder="Email del restaurant"
                defaultValue={formData.email}
                onChange={(e) => onChange(e,"email")}
                errorMessage={errorEmail}
            />
            <View style={styles.phoneView}>
                <CountryPicker
                    withFlag
                    withCallingCode
                    withFilter
                    withCallingCodeButton
                    containerStylee={styles.countryPicker}
                    countryCode={country}
                    onSelect={(country) =>{
                        setFormData({
                            ...formData,
                            "country":country.cca2,
                            "callingCode":country.callingCode[0]
                        })
                        setCountry(country.cca2)
                        setCallingCode(country.callingCode[0])
                    }}
                />
                <Input
                    placeholder="WatsApp del restaurant"
                    keyboardType="phone-pad"
                    containerStyle={styles.inputPhone}
                    defaultValue={formData.phone}
                    onChange={(e) => onChange(e,"phone")}
                    errorMessage={errorPhone}
                />
            </View>
            <Input
                    placeholder="Descripcion del restaurant"
                    multiline
                    containerStyle={styles.textArea}
                    defaultValue={formData.descripcion}
                    onChange={(e) => onChange(e,"descripcion")}
                    errorMessage={errorDescription}
                />
        </View>
    )

}

const defaultFormValues = () => {
    return {
        name: "",
        descripcion : "",
        email: "",
        phone: "",
        address: "",
        country: "EC",
        callingCode: "593"
    }
}

const styles = StyleSheet.create({
    viewContainer:{
        height: "100%"
    },
    viewForm: {
        marginHorizontal: 10
    },
    phoneView: {
        width: "80%",
        flexDirection: "row"
    },
    countryPicker: {
       
    },
    inputPhone: {
        width: "80%"
    },
    textArea: {
        height: 100,
        width: "100%"
    },
    btnAddRestaurant: {
        margin: 20,
        backgroundColor: "#442484"
    },
    viewImages:{
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 79,
        backgroundColor: "#e3e3e3"
    },
    minuatureStyle:{
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    mapStyle:{
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        margin: 10
    },
    viewMapBtnContainerSave:{
        paddingRight: 5
    },
    viewMapBtnContainerCancel:{
        paddingLeft: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#442482"
    },
    viewMapBtnCancel:{
        backgroundColor: "#a65273"
    }
})
