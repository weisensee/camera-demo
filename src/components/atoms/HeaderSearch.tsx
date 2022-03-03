import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Colors from '@constants/Colors';
import { HomeStackParamList, HomeTabComposite } from '@modules/types';

type NavType = CompositeNavigationProp<
    StackNavigationProp<HomeStackParamList, keyof HomeStackParamList>,
    HomeTabComposite
>;

function HeaderSearch() {
    const { navigate } = useNavigation<NavType>();

    const onPress = useCallback(() => navigate('Search'), [navigate]);

    return (
        <Icon
            color={Colors.darkGrey}
            containerStyle={styles.icon}
            name="search"
            onPress={onPress}
            type="feather"
        />
    );
}

export default React.memo(HeaderSearch);

const styles = StyleSheet.create({
    icon: { paddingRight: 20 },
});
