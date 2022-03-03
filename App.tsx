import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ThemedApp from './src/ThemedApp';

export default function App() {
    return (
        // <View style={styles.container}>
        <SafeAreaProvider>
            <GestureHandlerRootView style={styles.gestureView}>
                <ThemedApp />
            </GestureHandlerRootView>
        </SafeAreaProvider>
        // </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gestureView: { flex: 1 },
});
