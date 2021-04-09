import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { isEmpty, size } from 'lodash'

import { reauthenticate, updatePassword } from '../../utils/actions'
import { validateEmail } from '../../utils/helpers'

export default function ChangePasswordForm({ setShowModal, toastRef }) {
    const [newPassword, setNewPassword] = useState(null)
    const [currentpassword, setCurrentPassword] = useState(null)
    const [confirmpassword, setConfirmPassword] = useState(null)
    const [errorNewPassword, setErrorNewPassword] = useState(null)
    const [errorCurrentPassword, setErrorCurrentPassword] = useState(null)
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async() => {
        if(!validateForm()){
            return
        }

        setLoading(true)
        const resultReauthenticate = await reauthenticate(currentpassword)
        if (!resultReauthenticate.statusResponse){
            setLoading(false)
            setErrorCurrentPassword("Contraseña anterior incorrecta....")
            return
        }

        const resultUpdatePassword = await updatePassword(newPassword)
        setLoading(false)
        if (!resultUpdatePassword.statusResponse){
            setErrorNewPassword("Hubo un problema cambiando la contraseña, por favor intente mas tarde...")
            return
        }

        toastRef.current.show("Se ha actualizado la contraseña.",3000)
        setShowModal(false)
    } 

    const validateForm = () => {
        setErrorCurrentPassword(null)
        setErrorNewPassword(null)
        setErrorConfirmPassword(null)

        let isValid = true

        if(isEmpty(currentpassword) ){
            setErrorCurrentPassword("Debes Ingresar tu contraseña actual.")
            isValid = false
        }

        if(size(newPassword) < 6 ){
            setErrorNewPassword("Debes Ingresar una nueva contraseña de al menos 6 caracteres.")
            isValid = false
        }

        if(size(confirmpassword) < 6 ){
            setErrorConfirmPassword("Debes Ingresar una nueva confirmacion de tu contraseña de al menos 6 caracteres.")
            isValid = false
        }

        if(newPassword !== confirmpassword){
            setErrorNewPassword("La nueva contraseña y la confirmacion no son iguales.")
            setErrorConfirmPassword("La nueva contraseña y la confirmacion no son iguales.")
            isValid = false
        }

        if(newPassword === currentpassword){
            setErrorNewPassword("Debes ingresar una contraseña diferente al actual.")
            setErrorCurrentPassword("Debes ingresar una contraseña diferente al actual.")
            setErrorConfirmPassword("Debes ingresar una contraseña diferente al actual.")
            isValid = false
        }

        return isValid
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Ingrese tu contraseña actual....."
                containerStyle={styles.input}
                defaultValue={currentpassword}
                onChange={(e) => setCurrentPassword(e.nativeEvent.text)}
                errorMessage={errorCurrentPassword}
                password={true}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                        type= "material-community"
                        name={ showPassword ? "eye-off-outline" : "eye-outline" }
                        iconStyle={{ color: "#c2c2c2" }}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input
                placeholder="Ingrese tu nueva contraseña....."
                containerStyle={styles.input}
                defaultValue={newPassword}
                onChange={(e) => setNewPassword(e.nativeEvent.text)}
                errorMessage={errorNewPassword}
                password={true}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                        type= "material-community"
                        name={ showPassword ? "eye-off-outline" : "eye-outline" }
                        iconStyle={{ color: "#c2c2c2" }}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input
                placeholder="Ingrese tu confirmacion de nueva contraseña....."
                containerStyle={styles.input}
                defaultValue={confirmpassword}
                onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
                errorMessage={errorConfirmPassword}
                password={true}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                        type= "material-community"
                        name={ showPassword ? "eye-off-outline" : "eye-outline" }
                        iconStyle={{ color: "#c2c2c2" }}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Button
                title="Cambiar Contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={loading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingVertical: 10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        width: "95%"
    },
    btn: {
        backgroundColor: "#442484"
    }
})
