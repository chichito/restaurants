import React,{ useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { updateProfile, uploadImage } from '../../utils/actions'
import { loadImageFromGallery } from '../../utils/helpers'

export default function InfoUser({ user, setLoading, setLoadingText }) {
    const [photoUrl, setPhotoUrl] = useState(user.photoURL)

    const changePhoto = async () => {
        const result = await loadImageFromGallery([1, 1])
        if(!result.status){
            return
        }
        setLoadingText("Actulizando Imagen.....")
        setLoading(true)
        const resultUploadImage = await uploadImage(result.image, "avatar", user.uid)
        if (!resultUploadImage.statusResponse){
            setLoading(false)
            Alert.alert("Ha ocurrido un error al almacenar la foto de perfil...")
            return
        }
        const resultUploadProfile = await updateProfile({ photoURL: resultUploadImage.url })
        setLoading(false)

        if(resultUploadProfile.statusResponse){
            setPhotoUrl(resultUploadImage.url)
        }else{
            Alert.alert("Ha ocurrido un error al actualizar la foto del perfil...")
            return
        }

    } 

    return (
        <View style={styles.container}>
            <Avatar
                rounded
                size="large"
                onPress={changePhoto}
                source={
                    photoUrl 
                    ? { uri: photoUrl }
                    : require("../../assets/avatar-default.jpg")
                }
            />
            <View style={styles.infouser}>
                <Text style={styles.displaName}>
                    {
                        user.displayName ? user.displayName : "Anonimo"
                    }
                </Text>
                <Text>{ user.email }</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f9f9f9",
        paddingVertical: 30
    },
    infouser: {
        marginLeft: 20
    },
    displaName: {
        fontWeight: "bold",
        paddingBottom: 5
    }
})
