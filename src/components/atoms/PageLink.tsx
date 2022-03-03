import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';

import Colors from '@constants/Colors';
import Layout from '@constants/Layout';
import useRouteOnPress from '@hooks/useRouteOnPress';
import { APIPageLinks } from '@modules/api-types';
import { getTitle } from '@modules/api-utils';

function PageLink({ contents }: APIPageLinks) {
    const [isPressed, setIsPressed] = useState(false);
    const onPress = useRouteOnPress(contents);
    const title = getTitle(contents);

    return (
        <View style={styles.container}>
            <ListItem
                bottomDivider
                containerStyle={styles.listItem}
                underlayColor={Colors.white}
                onPress={onPress}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
            >
                <ListItem.Content>
                    <ListItem.Title
                        style={[styles.title, isPressed ? { color: Colors.primary } : {}]}
                    >
                        {title}
                    </ListItem.Title>
                </ListItem.Content>
            </ListItem>
        </View>
    );
}

export default memo(PageLink);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: (Layout.window.width - 350) / 2,
    },
    listItem: { alignSelf: 'center', paddingVertical: 15, paddingHorizontal: 1, maxWidth: 350 },
    title: { fontSize: 18, fontWeight: '500' },
});
