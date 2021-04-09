import React from 'react'
import Restaurants from '../screens/restaurants/Restaurants'
import { createStackNavigator } from '@react-navigation/stack'
import AddRestaurant from '../screens/restaurants/AddRestaurant'
import Restaurant from '../screens/restaurants/Restaurant'

const Stack = createStackNavigator()

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="restaurants"
                component={Restaurants}
                options={{ title: "Restaurants" }}
            />
            <Stack.Screen
                name="add-restaurant"
                component={AddRestaurant}
                options={{ title: "Restaurants" }}
            />
            <Stack.Screen
                name="restaurant"
                component={Restaurant}
            />
        </Stack.Navigator>
    )
}

