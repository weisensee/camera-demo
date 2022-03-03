import React, { memo, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps } from 'react-native-elements';

function ClearButton({ buttonStyle, titleStyle, ...rest }: ButtonProps) {
    const [isPressed, setIsPressed] = useState(false);
    const pressedStyle = useMemo(
        () =>
            isPressed
                ? {
                      borderColor: '#0e3173',
                      borderRadius: 10,
                      borderWidth: StyleSheet.hairlineWidth,
                  }
                : {},
        [isPressed]
    );

    return (
        <Button
            {...rest}
            buttonStyle={[styles.button, buttonStyle, pressedStyle]}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            titleStyle={[styles.title, titleStyle]}
            type="clear"
        />
    );
}

export default memo(ClearButton);

const styles = StyleSheet.create({
    button: { backgroundColor: 'transparent' },
    title: { color: 'white' },
});
