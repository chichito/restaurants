import React, { useState, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { getToRestaurants } from '../utils/actions'
import Loading from '../components/Loading'
import ListTopRestaurants from '../components/ranking/ListTopRestaurants'


export default function TopRestaurants({ navigation }) {
    const [restaurats, setRestaurats] = useState(null)
    const [loading, setLoading] = useState(false)

    console.log(restaurats)

    useFocusEffect(
        useCallback(() => {
               async function getData(){
                    setLoading(true)
                    const response = await getToRestaurants(10)
                    if (response.statusResponse){
                        setRestaurats(response.restaurants)
                    }
                    setLoading(false)
               } 
               getData()
            },[])
    )

    return (
        <View>
            <ListTopRestaurants
                restaurants={restaurats}
                navigation={navigation}
            />
            <Loading isVisible={loading} text="Por Favor espere......."/>
        </View>
    )
}

const styles = StyleSheet.create({})
