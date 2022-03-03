import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';

import Layout from '@constants/Layout';
import { APICardPage } from '@modules/api-types';
import { getDescription, getImage, getTitle } from '@modules/api-utils';
import useRouteOnPress from '@hooks/useRouteOnPress';
import Styles from '@modules/Styles';
import PrimaryButton from './PrimaryButton';

function TabItemCard({ contents }: APICardPage) {
    const image = getImage(contents);
    const description = getDescription(contents);
    const title = getTitle(contents);
    const onPress = useRouteOnPress(contents);

    return (
        <ListItem containerStyle={styles.listItem} onPress={onPress}>
            {image ? (
                <View style={[Styles.lightBackground, styles.imageContainer]}>
                    <Image
                        source={{ uri: image }}
                        resizeMode="contain"
                        style={styles.productImage}
                    />
                </View>
            ) : (
                <View />
            )}

            <View style={styles.textContainer}>
                <Text h4 style={[Styles.bold, styles.text]}>
                    {title}
                </Text>
                {description ? <Text style={styles.text}>{description}</Text> : null}
                <PrimaryButton
                    buttonStyle={styles.learnMore}
                    onPress={onPress}
                    title="Learn More"
                />
            </View>
        </ListItem>
    );
}

export default memo(TabItemCard);

const styles = StyleSheet.create({
    learnMore: {
        alignSelf: 'flex-start',
        height: 40,
        marginLeft: 10,
        width: (Layout.window.width * 0.3) / Layout.TAB_CARDS_PER_ROW,
    },
    listItem: {
        justifyContent: 'space-evenly',
    },
    imageContainer: {
        borderRadius: 10,
        flexDirection: 'row',
        width: (Layout.window.width * 0.4) / Layout.TAB_CARDS_PER_ROW,
    },
    textContainer: {
        flexDirection: 'column',
        width: (Layout.window.width * 0.4) / Layout.TAB_CARDS_PER_ROW,
    },
    productImage: {
        margin: (Layout.window.width * 0.025) / Layout.TAB_CARDS_PER_ROW,
        height: (Layout.window.width * 0.35) / Layout.TAB_CARDS_PER_ROW,
        width: (Layout.window.width * 0.35) / Layout.TAB_CARDS_PER_ROW,
    },
    text: {
        marginLeft: 10,
    },
});
