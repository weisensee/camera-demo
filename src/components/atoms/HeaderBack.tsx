import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import type { HeaderBackButtonProps } from '@react-navigation/elements';
import Colors from '../../Colors';

export default function HeaderBack({ canGoBack, disabled, label, onPress }: HeaderBackButtonProps) {
    return canGoBack ? (
        <Button
            buttonStyle={styles.button}
            containerStyle={{}}
            disabled={disabled}
            icon={{ color: Colors.darkestGrey, name: 'chevron-thin-left', type: 'entypo' }}
            onPress={onPress}
            title={label || 'Back'}
            titleStyle={styles.title}
            type="clear"
        />
    ) : null;
}

const styles = StyleSheet.create({
    button: { borderWidth: 0, paddingHorizontal: 10 },
    title: { color: Colors.darkestGrey },
});
