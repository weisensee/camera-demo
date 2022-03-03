import React, { memo, PropsWithChildren, useMemo, useState } from 'react';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { SvgUri } from 'react-native-svg';

import Colors from '@constants/Colors';
import Layout from '@constants/Layout';
import Styles from '@modules/Styles';
import ProductsIcon from './ProductsIcon';

type Props = PressableProps &
    React.RefAttributes<View> &
    PropsWithChildren<{
        image?: string;
        title: string;
        width: number;
    }>;

function SquareTileButton({ image, title, width, ...rest }: Props) {
    const [isPressed, setIsPressed] = useState(false);

    const textColor = useMemo(
        () => ({ color: isPressed ? Colors.darkestGrey : Colors.white }),
        [isPressed]
    );

    const iconProps = useMemo(
        () => ({
            fill: isPressed ? Colors.primary : Colors.white,
            height: width * 0.25,
            width: width * 0.25,
        }),
        [isPressed, width]
    );

    const icon = useMemo(
        () =>
            image ? (
                title.includes('Products & Accessories') ? (
                    <ProductsIcon {...iconProps} width={width * 0.45} />
                ) : (
                    <SvgUri {...iconProps} uri={image} />
                )
            ) : (
                <View />
            ),
        [iconProps, image, title, width]
    );

    const titleFontSize = useMemo(
        () =>
            // dynamically scale down font size based on run-on words length
            title && title.length > 10 && !title.includes(' ')
                ? { fontSize: 19 - (title.length - 10) }
                : {},
        [title]
    );

    return (
        <Pressable
            style={({ pressed }) => [
                Styles.shadow,
                styles.button,
                { height: width, width },
                pressed ? { backgroundColor: Colors.lightGrey } : {},
            ]}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            {...rest}
        >
            {icon}
            {title ? (
                <Text allowFontScaling={false} style={[styles.text, textColor, titleFontSize]}>
                    {title}
                </Text>
            ) : (
                <View />
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.secondary,
        borderRadius: 20,
        margin: Layout.TILE_PADDING,
        padding: Layout.TILE_PADDING + 7,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    text: {
        paddingVertical: 10,
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'left',
    },
});

export default memo(SquareTileButton);
