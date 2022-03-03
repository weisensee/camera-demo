import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ActivityIndicatorProps, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { BarCodeEvent, Constants as BarCodeConstants } from 'expo-barcode-scanner';
import { Camera, CameraMountError, CameraPictureOptions, Constants } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';

import ClearButton from './ClearButton';
import Colors from './Colors';
import useCameraScannerPermissions from './useCameraScannerPermissions';
import useFlashToggle from './useFlashToggle';

const barCodeScannerSettings = {
    barCodeTypes: [BarCodeConstants.BarCodeType.code128],
};

const onBarCodeScanned = async ({ data }: BarCodeEvent) =>
    console.log(`barcode scanning success`, data);

export default function CameraDemo() {
    const ref = useRef<Camera>(null);
    const [error, setError] = useState('');
    const [cameraType] = useState<'back' | 'front'>('back');

    const permission = useCameraScannerPermissions();

    const { flashMode, toggleFlashButton } = useFlashToggle();

    const onMountError = useCallback((event: CameraMountError) => {
        console.log(`Camera onMountError`, { event });
        setError(event.message);
    }, []);

    const secondaryActionButton = useMemo(
        () => (
            <View style={styles.secondaryActionsContainer}>
                <ClearButton
                    onPress={() => console.log(`on clear button press`)}
                    type="clear"
                    title="> Tap to search serial number"
                    titleStyle={styles.clearButtonText}
                />
            </View>
        ),
        []
    );

    const actionButtons = useMemo(
        () => (
            <>
                <SafeAreaView style={styles.actions}>
                    <View style={styles.topRowButtonContainer}>{toggleFlashButton}</View>
                    <View style={styles.lowerButtonContainer}>{secondaryActionButton}</View>
                </SafeAreaView>
                {/* pad background color of secondary button group for inset devices */}
                <View style={[styles.secondaryActionsPadding, { height: 50 }]} />
            </>
        ),
        [secondaryActionButton, toggleFlashButton]
    );

    if (error.length) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!permission) {
        return (
            <View style={styles.container}>
                <LoadingIndicator color={Colors.tint} />
                <Text style={styles.accessText}>Camera requires permission to access.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                ref={ref}
                autoFocus={Constants.AutoFocus.on}
                key={`${flashMode}_${cameraType}`}
                flashMode={flashMode}
                onMountError={onMountError}
                style={styles.camera}
                type={cameraType}
                useCamera2Api
                whiteBalance={Constants.WhiteBalance.auto}
                barCodeScannerSettings={barCodeScannerSettings}
                onBarCodeScanned={onBarCodeScanned}
            >
                {actionButtons}
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    accessText: { fontSize: 16, marginVertical: 30, textAlign: 'center', color: 'grey' },
    actions: {
        flex: 1,
        zIndex: 100,
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    button: { alignSelf: 'center' },
    lowerButtonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        width: '100%',
    },
    clearButtonText: { fontSize: 15 },
    container: { flex: 1, justifyContent: 'center', backgroundColor: '#2f2f2f' },
    camera: { flex: 1 },
    errorText: { color: Colors.errorRed, textAlign: 'center' },
    secondaryActionsContainer: {
        backgroundColor: '#000000aa',
        alignItems: 'center',
        alignContent: 'center',
        textAlignVertical: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    secondaryActionsPadding: {
        backgroundColor: '#000000aa',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    topRowButtonContainer: {
        backgroundColor: '#000000aa',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

function LoadingIndicator(props: ActivityIndicatorProps) {
    return <ActivityIndicator size="large" color={Colors.secondary} {...props} />;
}

export const CAMERA_OPTIONS: CameraPictureOptions = {
    quality: 0.5,
    base64: true,
    exif: true,
    // onPictureSaved :()=>{}
};
