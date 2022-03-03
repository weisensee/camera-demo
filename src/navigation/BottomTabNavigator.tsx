import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CameraNavigator from './CameraNavigator';
import Colors from '../Colors';
import Styles from '../Styles';
import CameraTabBarIcon from '../components/atoms/CameraTabBarIcon';

const BottomTab = createBottomTabNavigator<{
    Camera: undefined;
}>();

export default function BottomTabNavigator() {
    return (
        <BottomTab.Navigator
            initialRouteName="Camera"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.tint,
                tabBarLabelPosition: 'below-icon', // on tablets, display label under icon like phones
                tabBarStyle: Styles.tabBar,
                // tabBarItemStyle: { marginBottom: 5 },
            }}
        >
            {/* <BottomTab.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
            /> */}
            <BottomTab.Screen
                name="Camera"
                component={CameraNavigator}
                options={{
                    tabBarIcon: (props) => <CameraTabBarIcon {...props} />,
                }}
            />
            {/* <BottomTab.Screen
                name="More"
                component={MoreNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="dots-horizontal" color={color} />,
                }}
            /> */}
        </BottomTab.Navigator>
    );
}
