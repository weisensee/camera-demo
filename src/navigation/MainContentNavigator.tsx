import React from 'react';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from '../LinkingConfiguration';
import { NavigationContainer } from '@react-navigation/native';
import CameraDemo from '../CameraDemo';
const Stack = createStackNavigator();

const MainContentStack = createStackNavigator();

export default function MainContentNavigator() {
    return (
        <NavigationContainer linking={LinkingConfiguration}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Root">
                    {() => (
                        <MainContentStack.Navigator
                            initialRouteName="BottomTabs"
                            screenOptions={{ headerShown: false }}
                        >
                            <MainContentStack.Screen
                                name="BottomTabs"
                                component={BottomTabNavigator}
                            />
                            <MainContentStack.Screen
                                name="Scan Barcode"
                                component={CameraDemo}
                                initialParams={{ mode: 'scan' }}
                            />
                            {/* <MainContentStack.Screen
                                name="New Service Log"
                                component={NewServiceLog}
                                options={HeaderBackButtonOptions}
                            /> */}
                            <MainContentStack.Screen
                                name="Take Photo"
                                component={CameraDemo}
                                initialParams={{ mode: 'photo' }}
                            />
                        </MainContentStack.Navigator>
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
