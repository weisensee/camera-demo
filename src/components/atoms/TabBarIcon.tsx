import React from 'react';
import { StyleSheet } from 'react-native';
import { Icon, IconProps } from 'react-native-elements';

export default function TabBarIcon(props: IconProps) {
    return (
        <Icon containerStyle={styles.container} size={30} type="material-community" {...props} />
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: -5 },
});
