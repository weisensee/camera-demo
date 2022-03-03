import React, { useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import RaisedShadowedButton from '../components/atoms/RaisedShadowedButton';
import Layout from '../components/Layout';

type Props = {
    navigation: any;
    // navigation: CameraScreenNavigationProp;
};

export default function CameraScreen({ navigation: { navigate } }: Props) {
    const scanSerialNumber = useCallback(
        () => navigate('Scan Barcode', { mode: 'scan' }),
        [navigate]
    );

    const takePhoto = useCallback(() => navigate('Take Photo', { mode: 'photo' }), [navigate]);

    return (
        <View style={styles.container}>
            <RaisedShadowedButton iconName="camera" onPress={takePhoto} label="Take Photo" />
            <RaisedShadowedButton
                iconName="barcode-scan"
                onPress={scanSerialNumber}
                label="Scan Serial Number"
            />
            <Image
                source={require('../assets/images/serial_number_location.png')}
                resizeMode="contain"
                style={styles.guideImage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', flex: 1, justifyContent: 'space-evenly' },
    guideImage: {
        height: Math.max(200, Layout.window.height * 0.25),
        width: Layout.window.width * 0.8,
    },
});
