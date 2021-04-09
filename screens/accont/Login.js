import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Divider } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import LoginForm from '../../components/account/LoginForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Login() {
    return (
        <KeyboardAwareScrollView>
            <Image
                source={require("../../assets/restaurant-logo.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <View style={styles.container}>
                <LoginForm/>
                <CreateAccount/>
            </View>
            <Divider style={styles.divider}/>
        </KeyboardAwareScrollView>
    )
}

function CreateAccount(prps){
    const navigation = useNavigation()

    return (
        <Text
            onPress={() => navigation.navigate('register')} 
            style={styles.register}
        >
            Aun no tienes una cuenta? {" "}
            <Text style={styles.btnregister}>
                Registrate
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    image:{
        height: 150,
        width: "100%",
        marginBottom: 20
    },
    container:{
        marginHorizontal:40
    },
    divider:{
        backgroundColor: "#442484",
        margin: 40
    },
    register:{
        marginTop: 15,
        marginHorizontal: 10,
        alignSelf: "center"
    },
    btnregister: {
        color: "#442484",
        fontWeight: "bold"
    }
})
