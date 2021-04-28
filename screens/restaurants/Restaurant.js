import React, {useState, useEffect, useCallback, useRef } from 'react'
import { Alert, StyleSheet, Dimensions, Text, View, ScrollView } from 'react-native'
import CarouselImages from '../../components/CarouselImages'
import Loading from '../../components/Loading'
import { Icon, ListItem, Rating } from 'react-native-elements'
import { addDocumentWithoutId, formaPhone, getCurrecntUser, getDocumentById, getIsFavorite, deleteFavorite } from '../../utils/actions'
import MapRestaurant from '../../components/restaurants/MapRestaurant'
import { map } from 'lodash'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'

import ListReviews from '../../components/restaurants/ListReviews'
import { useFocusEffect } from '@react-navigation/native'

const widthScreen = Dimensions.get("window").width

export default function Restaurant({navigation, route }) {
    const {id, name} = route.params
    const toastRef = useRef()

    const [restaurant, setRestaurant] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const [loading, setLoading] = useState(false)

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    navigation.setOptions({ title: name})

    useEffect(() => {
        (async() => {
            if (userLogged && restaurant){
                const response = await getIsFavorite(restaurant.id)
                response.statusResponse && setIsFavorite(response.isFavorite)
            }
        })()
    }, [userLogged,restaurant])

    useFocusEffect (
        useCallback(() => {
            (async() => {
                const response = await getDocumentById("restaurants", id)
                if(response.statusResponse){
                    setRestaurant(response.document)
                } else {
                    setRestaurant({})
                    Alert.alert("Ocurrio un problema cargando el restaurant, intente mas tarde.")
                }
            })()
        }, [])
    )

    const addFavorite = async() => {
        if(!userLogged){
            toastRef.current.show("Para agregar el restaurante a favorites debes estar logueado.",3000)
            return
        }

        setLoading(true)
        const response = await addDocumentWithoutId("favorites", {
            idUser: getCurrecntUser().uid,
            idRestaurant: restaurant.id
        })
        setLoading(false)
        if(response.statusResponse){
            setIsFavorite(true)
            toastRef.current.show("Restaurante añadico a favoritos.",3000)
        } else {
            toastRef.current.show("No se puedo addicionar el restaurant a favoritos. Por favor intenta mas tarde",3000)
        }
    }

    const removeFavorite = async() => {
        setLoading(true)
        const response = await deleteFavorite(restaurant.id)
        setLoading(false)

        if(response.statusResponse){
            setIsFavorite(false)
            toastRef.current.show("Restaurante eliminado de favoritos.",3000)
        } else {
            toastRef.current.show("No se puedo eliminar el restaurant a favoritos. Por favor intenta mas tarde",3000)
        }
    }

    if(!restaurant){
        return <Loading isVisible={true} text="Cargando........"/>
    }

    return (
        <ScrollView style={styles.viewBody}>
            <CarouselImages
                images={restaurant.images}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <View style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={ isFavorite ? "heart" : "heart-outline"}
                    onPress={ isFavorite ? removeFavorite : addFavorite }
                    color= "#442484"
                    size={35}
                    underlayColor="transparent"
                />
            </View>
            <TitleRestaurant
                name={restaurant.name}
                descripcion={restaurant.descripcion}
                rating={restaurant.rating}
            />
            <RestaurantInfo
                name={restaurant.name}
                location={restaurant.location}
                address={restaurant.address}
                email={restaurant.email}
                phone={formaPhone(restaurant.callingCode, restaurant.phone)}
            />
            <ListReviews
                navigation={navigation}
                idRestaurant={restaurant.id}
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={loading} text="Por favor espere....."/>
        </ScrollView>
    )
}

function TitleRestaurant({ name, descripcion, rating}){
    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={styles.viewRestaurantContainer}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />                
            </View>
            <Text style={styles.descriptionRestaurant}>{descripcion}</Text>
        </View>
    )
}

function RestaurantInfo({name, location, address, email, phone}){
    const listInfo = [
        {text: address, iconName: "map-marker"},
        {text: phone, iconName: "phone"},
        {text: email, iconName: "at"},
    ]

    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.viewRestaurantInfoTitle}>
                Informacion sobre el restaurant
            </Text>
            <MapRestaurant
                location={location} 
                name= {name} 
                height= {150}
            />
            {
                map(listInfo, (item, index) => (
                    <ListItem
                        key={index}
                        style={styles.containerListItem}
                    >
                        <Icon
                            type="material-community"
                            name={item.iconName}
                            color={"#442484"}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.text}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewRestaurantTitle: {
        padding: 15
    },
    viewRestaurantContainer: {
        flexDirection: "row"
    },
    nameRestaurant: {
        fontWeight: "bold"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    descriptionRestaurant: {
        marginTop: 8,
        color: "gray",
        textAlign: "justify"
    },
    viewRestaurantInfo:{
        margin: 15,
        marginTop: 25
    },
    viewRestaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    containerListItem: {
        borderBottomColor: "#a376c7",
        borderBottomWidth: 1
    },
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15
    }
})
