import React, { memo, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, ButtonProps } from 'react-native-elements';

import Colors from '@constants/Colors';
import Styles from '@modules/Styles';

function GradientGrayButton({ buttonStyle, ...rest }: ButtonProps) {
    const [isPressed, setIsPressed] = useState(false);
    const pressedStyle = useMemo(
        () =>
            isPressed
                ? { borderColor: Colors.darkestGrey, borderWidth: StyleSheet.hairlineWidth }
                : {},
        [isPressed]
    );

    return (
        <Button
            activeOpacity={0.7}
            buttonStyle={[Styles.shadow, styles.button, buttonStyle, pressedStyle]}
            titleStyle={styles.title}
            {...rest}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            linearGradientProps={{
                colors: [Colors.lightGrey, Colors.white],
                start: { x: 0.5, y: 1 },
                end: { x: 0.5, y: 0 },
            }}
            ViewComponent={LinearGradient}
        />
    );
}

export default memo(GradientGrayButton);

const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        borderRadius: 10,
        height: 55,
        marginVertical: 15,
        width: 280,
    },
    title: { color: Colors.primary },
});
