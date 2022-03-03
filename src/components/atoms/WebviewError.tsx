import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import * as Updates from 'expo-updates';

export default function WebviewError() {
    return (
        <View style={styles.containerStyle}>
            <Text style={styles.titleText}>{`Whoops!`}</Text>
            <Text style={styles.subtitle}>{`Something went wrong.`}</Text>
            <Text
                style={styles.subtitle}
            >{`We've located and logged the issue, sorry for any inconvenience.`}</Text>
            <View style={styles.buttonContainer}>
                <Button
                    buttonStyle={styles.button}
                    onPress={Updates.reloadAsync}
                    type="outline"
                    title="Reload app"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        marginVertical: 10,
        width: '100%',
    },
    buttonContainer: { marginVertical: 20 },
    containerStyle: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        padding: 50,
    },
    subtitle: { fontSize: 16, color: '#1f1f1f', marginBottom: 10, textAlign: 'center' },
    titleText: { fontSize: 18, color: '#1f1f1f', marginBottom: 20 },
});
