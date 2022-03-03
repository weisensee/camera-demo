import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
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
                        colors={['transparent', Colors.lightBackground, Colors.lightBackground]}
                        style={styles.gradientBackground}
                    >
                        <View style={styles.gradientChildren}>
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
                    </LinearGradient>
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
        marginBottom: 20,
        width: 700,
    },
    container: {
        alignContent: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    shadowedContainer: {
        backgroundColor: Colors.lightBackground,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 10,
        flex: 1,
        flexDirection: 'column',
        height: 400,
        marginBottom: 20,
        overflow: 'visible',
        width: '100%',
    },
    gradientChildren: {
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'row',
        maxWidth: 500,
    },
    productImageContainer: {
        alignContent: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        zIndex: 10,
    },
    productImage: {
        height: 240,
        width: 180,
    },
    gradientContainer: {
        backgroundColor: 'transparent',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        bottom: 0,
        flex: 1,
        flexDirection: 'row',
        overflow: 'visible',
        position: 'absolute',
        width: '100%',
        zIndex: 8,
    },
    textWrapContainer: { flexDirection: 'row' },
    tagline: { fontSize: 18, flex: 1, flexWrap: 'wrap' },
    gradientBackground: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        justifyContent: 'center',
        marginBottom: -100,
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
