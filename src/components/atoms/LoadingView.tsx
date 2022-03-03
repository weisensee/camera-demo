import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Colors from '../../Colors';

import LoadingIndicator from './LoadingIndicator';

export default function LoadingView(props: { style?: StyleProp<ViewStyle> | undefined }) {
    return (
        <View style={[styles.container, props?.style || {}]}>
            <LoadingIndicator />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: Colors.background,
        flex: 1,
        justifyContent: 'center',
    },
});
