import { useEffect, useMemo, useState } from 'react';
// import { BarCodeScanner, PermissionHookOptions } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

export default function useCameraScannerPermissions(): boolean {
    const [cameraPermission] = Camera.useCameraPermissions(CAMERA_PERMISSION_CONFIG);
    // const [scanningPermission, setScanningPermission] = useState(false);

    // useEffect(() => {
    //     const requestScannerPermission = async () => {
    //         if (isScanning) {
    //             let { granted } = await BarCodeScanner.getPermissionsAsync();
    //             if (!granted) {
    //                 granted = (await BarCodeScanner.requestPermissionsAsync()).granted;
    //             }
    //             setScanningPermission(granted);
    //         }
    //     };

    //     requestScannerPermission();
    // }, [isScanning]);

    const permission = !!cameraPermission?.granted;

    return useMemo(() => permission, [permission]);
}

const CAMERA_PERMISSION_CONFIG = {
    /** If the hook should automatically fetch the current permission status, without asking the user. */
    get: true,
    /** If the hook should automatically request the user to grant permission. */
    request: true,
};
