import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

const appVersion =
    Updates.manifest && 'version' in Updates.manifest
        ? Updates.manifest.version
        : Constants.manifest?.version;

type Props = {
    center?: boolean;
};

export default function VersionInfo({ center }: Props) {
    return (
        <View style={[styles.versionContainer, center ? styles.center : {}]}>
            <Text style={[styles.companyName, center ? styles.centerText : {}]}>Navien Inc</Text>
            <Text>{`App Version ${appVersion}`}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { alignSelf: 'center' },
    centerText: { textAlign: 'center' },
    companyName: { fontSize: 20 },
    versionContainer: { padding: 30, marginVertical: 20 },
});
