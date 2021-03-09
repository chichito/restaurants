import React from 'react'
import Restaurants from '../screens/Restaurants'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="restaurants"
                component={Restaurants}
                options={{ title: "Restaurants" }}
            />
        </Stack.Navigator>
    )
}

