import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

function HeaderLogo() {
    return (
        <Image
            resizeMode="contain"
            source={require('../../assets/images/brand-logo.png')}
            style={styles.logo}
        />
    );
}

export default memo(HeaderLogo);

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        height: 30,
        width: 140,
    },
});
