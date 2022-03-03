import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ActivityIndicatorProps, Alert, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { BarCodeEvent, Constants as BarCodeConstants } from 'expo-barcode-scanner';
import { Camera, CameraMountError, CameraPictureOptions, Constants } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import useLatest from 'react-use/lib/useLatest';

import ClearButton from './ClearButton';
import PrimaryButton from './PrimaryButton';
import Colors from './Colors';
import useCameraScannerPermissions from './useCameraScannerPermissions';
import useFlashToggle from './useFlashToggle';

export default function CameraDemo() {
    const { bottom, top } = useSafeAreaInsets();
    const ref = useRef<Camera>(null);
    const [error, setError] = useState('');
    const [mode, setMode] = useState('photo');
    const [ready, setReady] = useState(false);
    const [photoTaken, setPhotoTaken] = useState(false);
    const [cameraType, setCameraType] = useState<'back' | 'front'>('back');

    const isScanning = mode === 'scan';

    const permission = useCameraScannerPermissions(isScanning);

    const onPressFlip = useLatest(() =>
        setCameraType(cameraType === 'back' ? 'front' : 'back')
    ).current;

    const startTransitionCamera = useCallback(
        (onChange: () => void) => {
            if (isScanning) {
                setReady(false);
                setTimeout(() => {
                    onChange();
                    setReady(true);
                }, 2000);
            } else {
                onChange();
            }
        },
        [isScanning]
    );

    const { flashMode, toggleFlashButton } = useFlashToggle(startTransitionCamera);

    const switchMode = useCallback(() => {
        startTransitionCamera(() => setMode(isScanning ? 'photo' : 'scan'));
    }, [isScanning, startTransitionCamera]);

    const takePhoto = useCallback(async () => {
        try {
            if (ref.current) {
                const photo = await ref.current?.takePictureAsync(CAMERA_OPTIONS);

                const permissionGranted =
                    (await MediaLibrary.getPermissionsAsync(false)).granted ||
                    (await MediaLibrary.requestPermissionsAsync(false)).granted;

                if (permissionGranted) {
                    console.log(`got uri: ${photo.uri}`);
                } else {
                    Alert.alert(
                        'Media library permission required',
                        'Media library permissions are required to take photos.'
                    );
                }
                setPhotoTaken(true);
            } else {
                console.warn(`[takePhoto] Camera not ready yet`);
            }
        } catch (error) {
            console.warn(`[takePhoto] failed to access Camera instance`);
        }
    }, []);

    const onCameraReady = useCallback(() => {
        setError('');
        setReady(true);
    }, []);

    const onMountError = useCallback((event: CameraMountError) => {
        console.log(`Camera onMountError`, { event });
        setReady(false);
        setError(event.message);
    }, []);

    const photoSuccessMessage = useMemo(
        () =>
            photoTaken ? (
                <ClearButton
                    buttonStyle={styles.photoSuccessButton}
                    icon={{ name: 'chevron-double-right', type: 'material-community' }}
                    iconPosition="right"
                    onPress={() => console.log(`clear btn onPress`)}
                    title={`Tap here to scan`}
                    titleStyle={styles.photoSuccessTitle}
                />
            ) : null,
        [photoTaken]
    );

    const mainActionButton = useMemo(
        () =>
            isScanning ? null : (
                <Icon
                    color={Colors.primary}
                    containerStyle={styles.button}
                    name="camera"
                    onPress={takePhoto}
                    raised
                    reverse
                    size={32}
                    type="material-community"
                    tvParallaxProperties={undefined}
                />
            ),
        [isScanning, takePhoto]
    );

    const secondaryActionButton = useMemo(
        () => (
            <View style={styles.secondaryActionsContainer}>
                {isScanning ? (
                    <ClearButton
                        onPress={() => console.log(`on clear button press`)}
                        type="clear"
                        title="> Tap to search serial number"
                        titleStyle={styles.clearButtonText}
                    />
                ) : (
                    // placeholder view for flex layout
                    <View />
                )}
                {/* disable flip camera while scanning due to Android bugs */}
                {isScanning ? null : (
                    <PrimaryButton
                        buttonStyle={styles.flipButton}
                        icon={{ color: 'white', name: 'flip-camera-android', type: 'material' }}
                        onPress={onPressFlip}
                        title="Flip"
                    />
                )}

                {/* placeholder view for spacing */}
                {isScanning ? null : <View />}
            </View>
        ),
        [isScanning, onPressFlip, switchMode]
    );

    const actionButtons = useMemo(
        () => (
            <>
                {/* pad background color of top button group for inset devices */}
                <LinearGradient
                    colors={['#00000000', styles.topActionsPadding.backgroundColor]}
                    style={[styles.topActionsPadding, { height: top }]}
                />
                <SafeAreaView style={styles.actions}>
                    <View style={styles.topRowButtonContainer}>{toggleFlashButton}</View>
                    <View style={styles.lowerButtonContainer}>
                        {photoSuccessMessage}
                        {mainActionButton}
                        {secondaryActionButton}
                    </View>
                </SafeAreaView>
                {/* pad background color of secondary button group for inset devices */}
                <View style={[styles.secondaryActionsPadding, { height: bottom }]} />
            </>
        ),
        [
            top,
            isScanning,
            mainActionButton,
            photoSuccessMessage,
            secondaryActionButton,
            toggleFlashButton,
        ]
    );

    const cameraScanningSettings = useMemo(
        () =>
            isScanning && ready
                ? {
                      barCodeScannerSettings: {
                          barCodeTypes: [BarCodeConstants.BarCodeType.code128],
                      },
                      onBarCodeScanned: async ({ data }: BarCodeEvent) =>
                          console.log(`barcode scanning success`, data),
                  }
                : {},
        [isScanning, ready]
    );

    const cameraContent = useMemo(() => {
        if (error.length) {
            return <Text style={styles.errorText}>{error}</Text>;
        }

        if (!permission) {
            return (
                <>
                    <LoadingIndicator color={Colors.tint} />
                    <Text style={styles.accessText}>Camera requires permission to access.</Text>
                </>
            );
        }

        return (
            <Camera
                ref={ref}
                autoFocus={Constants.AutoFocus.on}
                flashMode={flashMode}
                onCameraReady={onCameraReady}
                onMountError={onMountError}
                style={styles.camera}
                type={cameraType}
                useCamera2Api
                whiteBalance={Constants.WhiteBalance.auto}
                {...cameraScanningSettings}
            >
                {actionButtons}
            </Camera>
        );
    }, [
        actionButtons,
        cameraScanningSettings,
        cameraType,
        error,
        flashMode,
        onCameraReady,
        onMountError,
        permission,
    ]);

    return <View style={styles.container}>{cameraContent}</View>;
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
    close: { alignSelf: 'flex-end', margin: 25 },
    container: { flex: 1, justifyContent: 'center', backgroundColor: '#2f2f2f' },
    camera: { flex: 1 },
    errorText: { color: Colors.errorRed, textAlign: 'center' },
    flipButton: { width: 100 },
    photoSuccessButton: { backgroundColor: '#00000099', marginBottom: 15 },
    photoSuccessTitle: { fontSize: 13, padding: 10 },
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
    topActionsPadding: {
        backgroundColor: '#0000006d',
        position: 'absolute',
        top: 0,
        width: '100%',
    },
    secondaryActionsPadding: {
        backgroundColor: '#000000aa',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    switchMode: { position: 'absolute', right: 10 },
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
