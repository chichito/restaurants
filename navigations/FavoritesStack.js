import React from 'react'
import Favorites from '../screens/Favorites'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

export default function FavoritesStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="favorites"
                component={Favorites}
                options={{ title: "Favorites" }}
            />
        </Stack.Navigator>
    )
}
