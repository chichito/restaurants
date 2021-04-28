import React, { useState, useEffect,useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import firebase from 'firebase/app'
import { useFocusEffect } from '@react-navigation/native'
import Loading from '../../components/Loading'
import { getMoreRestaurants, getRestaurants } from '../../utils/actions'
import { size } from 'lodash'
import ListRestaurants from '../../components/restaurants/ListRestaurants'

export default function Restaurants({ navigation }) {
    const [login, setLogin] = useState(null)
    const [startRestaurant, setStartRestaurant] = useState(null)
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(null)

    const limitRestaurants = 7
    console.log("restaurants", size(restaurants))

    useEffect (() => {
            firebase.auth().onAuthStateChanged((userInfo) => {
                userInfo ? setLogin(true) : setLogin(false) 
            })
        }, [])
    
    useFocusEffect(
        useCallback(() => {
            async function getData(){
                setLoading(true)
                const response = await getRestaurants(limitRestaurants)
                if(response.statusResponse){
                    setStartRestaurant(response.startRestaurant)
                    setRestaurants(response.restaurants)
                }                
                setLoading(false)
            }
            getData()
            },[])
    )

    const handleLoadMore = async() => {
        if(!startRestaurant){
            return
        }
        setLoading(true)
        const response = await getMoreRestaurants(limitRestaurants,startRestaurant)
        if(response.statusResponse){
            setStartRestaurant(response.startRestaurant)
            setRestaurants([...restaurants, ...response.restaurants])
        }
setLoading(false)
    }
  
    if(login == null){
        return <Loading isVisible={true} text="Cargando....."/>
    }

    return (
        <View style={styles.viewBody}>
            {
                size(restaurants) > 0 ? (                    
                    <ListRestaurants 
                        restaurants={restaurants} 
                        navigation={navigation}
                        handleLoadMore={handleLoadMore}
                    />
                ) : (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No hay Restaurants Registrados</Text>
                    </View>
                )
            }
            {
                login && (                 
                    <Icon
                        type="material-community"
                        name="plus"
                        color="#442484"
                        reverse
                        containerStyle={styles.btnContainer}
                        onPress={() => navigation.navigate("add-restaurant")}
                    />
                )
            }         
            <Loading isVisible={loading} text="Cargando restaurants"/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        textShadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5
    },
    notFoundView:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    notFoundText: {
        fontSize: 18,
        fontWeight: "bold"
    }
})
