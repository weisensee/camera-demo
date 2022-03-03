import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextProps } from 'react-native-elements';

import Colors from '@constants/Colors';

function InputLabel({ children, style, ...rest }: TextProps) {
    return (
        <Text {...rest} style={[styles.label, style]}>
            {children}
        </Text>
    );
}

export default memo(InputLabel);

const styles = StyleSheet.create({
    label: { color: Colors.greyLabel },
});
