import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Account from '../screens/accont/Account'
import Login from '../screens/accont/Login'
import Register from '../screens/accont/Register'

const Stack = createStackNavigator()

export default function AccountStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="account"
                component={Account}
                options={{ title: "Cuenta" }}
            />
            <Stack.Screen
                name="login"
                component={Login}
                options={{ title: "Iniciar Seccion" }}
            />
            <Stack.Screen
                name="register"
                component={Register}
                options={{ title: "Registro de usuario" }}
            />
        </Stack.Navigator>
    )
}
