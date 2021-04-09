import React,{ useState, useEffect, useCallback} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getCurrecntUser, isUserLogged } from '../../utils/actions'
import UserGuest from './UserGuest'
import UserLogged from './UserLogged'
import Loading from '../../components/Loading'
import { useFocusEffect } from '@react-navigation/native'

export default function Account() {

    const [login, setLogin] = useState(null)

    useFocusEffect (
        useCallback(() => {
            const user = getCurrecntUser()      
            user ? setLogin(true) : setLogin(false)
        }, [])
    )

    if(login == null){
        return <Loading isVisible={true} text="Cargando....."/>
    }

    return login ? <UserLogged/> : <UserGuest/>
}

const styles = StyleSheet.create({})
