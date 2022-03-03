import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Icon, ListItem, Text } from 'react-native-elements';
import * as Linking from 'expo-linking';
import { useDispatch, useSelector } from 'react-redux';

import VersionInfo from '@atoms/VersionInfo';
import { View } from '../components/Themed';
import Colors from '@constants/Colors';
import { updateMainMenu } from '@modules/actions/pageActions';
import { logOut } from '@modules/actions/userLogout';
import { NavMenuOption } from '@modules/api-types';
import { API_ROUTES } from '@modules/constants';
import { AppState, ThunkDispatch } from '@modules/redux-types';
import Styles from '@modules/Styles';
import { MoreScreenNavigationProp } from '@modules/types';

type Props = {
    navigation: MoreScreenNavigationProp;
};

const ICON_PROPS = {
    color: Colors.darkGrey,
    size: 28,
};

function MoreScreen({ navigation: { navigate } }: Props) {
    const dispatch = useDispatch<ThunkDispatch>();
    const user = useSelector((state: AppState) => state.user.user);
    const menuOptions = useSelector((state: AppState) => state.pages[API_ROUTES.MENU_NAV]);

    const userLoggedIn = user && user.email?.length;

    useEffect(() => {
        dispatch(updateMainMenu());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const externalMenuOptions = useMemo(() => {
        if (menuOptions && 'items' in menuOptions) {
            // @ts-ignore
            const mobileOptions: NavMenuOption[] = menuOptions.items || [];
            return mobileOptions.map((item: NavMenuOption) => {
                const smsIndex = item.url.indexOf('sms:+');
                const isHome = ['Home', 'home'].includes(item.title);
                const isSMS = smsIndex >= 1;
                const itemUrl = isSMS ? item.url.slice(smsIndex) : item.url;
                const icon = isSMS ? (
                    <Icon {...ICON_PROPS} name="message-outline" type="material-community" />
                ) : isHome ? (
                    <Icon {...ICON_PROPS} name="home" type="material-community" />
                ) : (
                    <Icon {...ICON_PROPS} name="external-link" type="feather" />
                );

                return {
                    icon,
                    label: item.title,
                    onPress: () =>
                        isSMS
                            ? Linking.openURL(itemUrl)
                            : isHome
                            ? // @ts-ignore
                              navigate('Home', { screen: 'HomeScreen' })
                            : navigate('WebView', { url: itemUrl, title: item.title }),
                };
            });
        }
        return [];
    }, [menuOptions, navigate]);

    const options = [...externalMenuOptions];

    if (userLoggedIn) {
        options.unshift({
            icon: <Icon {...ICON_PROPS} name="person-outline" type="iconicon" />,
            label: 'Profile',
            onPress: () => navigate('Profile'),
        });
        options.push({
            icon: <Icon {...ICON_PROPS} name="logout" type="material" />,
            label: 'Logout',
            onPress: () => dispatch(logOut()),
        });
    } else {
        options.push({
            icon: <Icon {...ICON_PROPS} name="login" type="material" />,
            label: 'Log in',
            onPress: () => dispatch(logOut()),
        });
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text h4 style={[Styles.title, styles.listItem]}>
                    Options
                </Text>
                {options.map((item, i) => (
                    <ListItem
                        key={i}
                        bottomDivider
                        containerStyle={styles.listItem}
                        onPress={item.onPress}
                    >
                        {item.icon}
                        <ListItem.Content>
                            <ListItem.Title>{item.label}</ListItem.Title>
                            {/* <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle> */}
                        </ListItem.Content>
                    </ListItem>
                ))}
                <VersionInfo />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    listItem: { paddingVertical: 25, paddingHorizontal: 40 },
});

export default MoreScreen;
