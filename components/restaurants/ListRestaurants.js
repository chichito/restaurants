import { size } from 'lodash'
import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Image } from 'react-native-elements'
import { formaPhone, getMoreRestaurants } from '../../utils/actions'

export default function ListRestaurants({ restaurants,navigation, handleLoadMore }) {
    //console.log(restaurants)
    return (
        <View>
            <FlatList
                data={restaurants}
                keyExtractor={(iten, index) => index.toString() }
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(restaurant) => (
                    <Restaurant restaurant={restaurant} navigation={navigation}/>
                )}
            />
        </View>
    )
}
 
function Restaurant({restaurant,navigation}){
    const {id, images, name, address, descripcion, phone, callingCode} = restaurant.item
    const imageRestaurant = images[0]

    const getMoreRestaurant = () => {
        navigation.navigate("restaurant", {id, name})
    }

    return (
        <TouchableOpacity onPress={getMoreRestaurant}>
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff"/>}
                        source={{ uri: imageRestaurant }}
                        style={styles.imageRestaurant}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantTitle}>{name}</Text>
                    <Text style={styles.restaurantInformation}>{address}</Text>
                    <Text style={styles.restaurantInformation}>{formaPhone(callingCode,phone)}</Text>
                    <Text style={styles.restaurantDescription}>
                        {
                            size(descripcion) > 60
                            ? `${descripcion.substr(0,60)}...`
                            : descripcion
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
    
}

const styles = StyleSheet.create({
    viewRestaurant: {
        flexDirection: "row",
        margin: 10
    },
    viewRestaurantImage: {
        marginRight: 15
    },
    imageRestaurant:{
        width: 90,
        height: 90
    },
    restaurantTitle:{
        fontWeight: "bold"
    },
    restaurantInformation:{
        paddingTop: 2,
        color: "grey"
    },
    restaurantDescription:{
        paddingTop: 2,
        color: "grey",
        width: "75%"
    }
})
