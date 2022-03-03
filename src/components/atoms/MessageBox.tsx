import Colors from '@constants/Colors';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Icon, Text } from 'react-native-elements';

interface Props extends Pick<ViewProps, 'style'> {
    error?: boolean;
    text?: string;
}

export default function MessageBox({ error, style, text }: Props) {
    if (!text?.length) {
        return null;
    } else {
        const colorStyles = error ? styles.errorBox : {};

        return (
            <View style={[styles.outlinedBox, colorStyles, style]}>
                {error ? (
                    <Icon color={Colors.errorRed} name="warning-outline" size={20} type="ionicon" />
                ) : null}
                <View style={styles.container}>
                    <Text>{text}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    outlinedBox: {
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        paddingVertical: 20,
        borderColor: Colors.secondary,
        borderWidth: 2,
        borderRadius: 8,
        backgroundColor: Colors.lightGrey,
        padding: 15,
        marginVertical: 15,
        width: '95%',
    },
    errorBox: {
        borderColor: Colors.errorRed,
        backgroundColor: Colors.errorBackground,
        marginBottom: 20,
        marginTop: -10,
        paddingVertical: 5,
        padding: 10,
    },
});
