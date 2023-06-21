import { isEmpty } from 'lodash'
import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Search({ navigation }) {
    const [search, setSearch] = useState("T")
    const [restaurants, setRestaurants] = useState(null)

    console.log(restaurants)


    useEffect(() => {
        if( isEmpty(search)){
            return
        }
        
    }, [search])

    return (
        <View>
            <Text>Search</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
