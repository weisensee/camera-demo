import React, { memo, useMemo, useState } from 'react';
import { Platform, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, ButtonProps } from 'react-native-elements';

import Colors from '@constants/Colors';
import Styles from '@modules/Styles';

const BORDERLESS_RIPPLE = false;

function PrimaryButton({ buttonStyle, ...rest }: ButtonProps) {
    const [isPressed, setIsPressed] = useState(false);
    const pressedStyle = useMemo(
        () =>
            isPressed
                ? { borderColor: Colors.secondary, borderWidth: StyleSheet.hairlineWidth }
                : {},
        [isPressed]
    );

    return (
        <Button
            {...rest}
            activeOpacity={0.7}
            background={Platform.select({
                android: TouchableNativeFeedback.Ripple('white', BORDERLESS_RIPPLE),
                ios: undefined,
            })}
            buttonStyle={[Styles.shadow, styles.button, buttonStyle, pressedStyle]}
            containerStyle={Platform.select({ ios: Styles.shadow })}
            disabledTitleStyle={styles.disabledTitle}
            linearGradientProps={{
                colors: [Colors.primary, '#FF851E'],
                start: { x: 0.5, y: 1 },
                end: { x: 0.5, y: 0 },
            }}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            ViewComponent={LinearGradient}
        />
    );
}

export default memo(PrimaryButton);

const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        borderRadius: 10,
        height: 55,
        marginVertical: 15,
        width: 280,
    },
    disabledTitle: {
        color: '#00000050',
    },
});
