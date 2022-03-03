import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import { View } from '../components/Themed';
import Layout from '@constants/Layout';
import { AuthStackParamList } from '@modules/types';
import { setUser } from '@modules/actions/userActions';
import Colors from '@constants/Colors';
import GradientGrayButton from '@atoms/GradientGrayButton';
import PrimaryButton from '@atoms/PrimaryButton';

export default function AuthLandingScreen(
    props: StackScreenProps<AuthStackParamList, 'AuthLanding'>
) {
    const dispatch = useDispatch();
    const guestMode = () => dispatch(setUser({ email: '', username: 'Guest' }));

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/brand-logo.png')}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.pageContent}>
                <View style={styles.blueContainer}>
                    <View style={styles.featuredImageContainer}>
                        <Image
                            source={require('../assets/images/contractor.png')}
                            resizeMode="cover"
                            style={styles.featuredImage}
                        />
                    </View>
                    <Text h4 style={styles.text}>{`Welcome to Navien`}</Text>
                    <PrimaryButton
                        buttonStyle={styles.button}
                        icon={{ name: 'email', type: 'material-community' }}
                        onPress={() => props.navigation.navigate('Login')}
                        title="Login with email"
                    />
                    <GradientGrayButton
                        buttonStyle={styles.button}
                        onPress={() => guestMode()}
                        title="Browse as guest"
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    blueContainer: {
        backgroundColor: Colors.secondary,
        borderRadius: 20,
        justifyContent: 'space-around',
        height: 420 + Layout.window.width * 0.15,
        padding: 30,
    },
    button: { width: 250 },
    container: { alignItems: 'center', flex: 1, justifyContent: 'space-evenly' },
    featuredImage: {
        height: 220 + Layout.window.width * 0.15,
        width: 220 + Layout.window.width * 0.15,
    },
    featuredImageContainer: {
        alignSelf: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        top: -Layout.window.height * 0.15,
        height: 220 + Layout.window.width * 0.15,
        width: 220 + Layout.window.width * 0.15,
    },
    logo: {
        marginBottom: 110,
        height: 30,
        width: 200,
    },
    pageContent: { width: '80%' },
    text: { color: Colors.white, marginVertical: 10, textAlign: 'center' },
});
