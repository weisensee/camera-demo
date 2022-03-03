import React, { memo } from 'react';
import { Image, StyleSheet, Text, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { APIPageHeader } from '@modules/api-types';
import { getBackgroundImage, getProductImage, getTagline, getTitle } from '@modules/api-utils';
import Colors from '@constants/Colors';

function PageHeader({ contents }: APIPageHeader) {
    const backgroundImage = getBackgroundImage(contents);
    const productImage = getProductImage(contents);
    const title = getTitle(contents);
    const tagline = getTagline(contents);

    return (
        <View style={styles.container}>
            <View style={styles.shadowedContainer}>
                <Image
                    resizeMode="cover"
                    source={{ uri: backgroundImage }}
                    style={styles.backgroundImage}
                />
                <View style={styles.gradientContainer}>
                    <LinearGradient
                        // colors={['transparent', Colors.errorRed]}
                        colors={['#FFFFFF00', Colors.lightBackground, Colors.lightBackground]}
                        style={styles.gradientBackground}
                    />
                </View>
            </View>
            <View style={styles.productInfoContainer}>
                <View
                    style={{
                        height: styles.productImage.height,
                        ...styles.productImageContainer,
                    }}
                >
                    <Image
                        source={{ uri: productImage }}
                        resizeMode="contain"
                        style={styles.productImage}
                    />
                </View>
                <View style={styles.textContainer}>
                    <View style={styles.textWrapContainer}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={styles.textWrapContainer}>
                        <Text style={styles.tagline}>{tagline}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default memo(PageHeader);

const styles = StyleSheet.create({
    backgroundImage: {
        alignSelf: 'center',
        height: 400,
        width: 700,
        marginBottom: 20,
    },
    container: {
        alignContent: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: 'center',
        marginBottom: 60,
        overflow: 'visible',
    },
    shadowedContainer: {
        backgroundColor: Colors.lightBackground,
        flex: 1,
        flexDirection: 'column',
        height: 400,
        marginBottom: 20,
        // overflow: 'hidden',
        width: '100%',

        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: {
                    width: 0,
                    height: 15,
                },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                zIndex: 3,
            },
        }),
    },
    productInfoContainer: {
        alignSelf: 'center',
        bottom: 0,
        flexDirection: 'row',
        flex: 1,
        marginBottom: -50,
        maxWidth: 500,
        position: 'absolute',
        zIndex: 12,
    },
    productImageContainer: {
        alignContent: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        overflow: 'visible',
        zIndex: 10,
    },
    productImage: {
        height: 240,
        overflow: 'visible',
        width: 180,
    },
    gradientContainer: {
        backgroundColor: 'transparent',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        bottom: -10,
        flex: 1,
        flexDirection: 'row',
        height: 240,
        position: 'absolute',
        overflow: 'hidden',
        width: '100%',
        zIndex: 8,
    },
    textWrapContainer: { flexDirection: 'row' },
    tagline: { fontSize: 18, flex: 1, flexWrap: 'wrap' },
    gradientBackground: {
        backgroundColor: 'transparent',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        height: '100%',
        overflow: 'hidden',
        width: '100%',
        zIndex: 9,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingRight: 15,
        zIndex: 10,
    },
    title: { fontSize: 26, fontWeight: '700', flex: 1, flexWrap: 'wrap' },
});
