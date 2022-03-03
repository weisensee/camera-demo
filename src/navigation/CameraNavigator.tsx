import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HeaderBack from '../components/atoms/HeaderBack';
import CameraScreen from '../screens/CameraScreen';
import SearchSerial from '../screens/SearchSerial';
import WebViewScreen from '../screens/WebViewScreen';
import Styles from '../Styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type CameraStackParamList = {
    CameraScreen: undefined;
    NativeCmsScreen: { route: string; title: string };
    Search: { query: string } | undefined;
    SearchSerial: { query: string } | undefined;
    WebView: { title: string; url: string };
};

const CameraStack = createStackNavigator<CameraStackParamList>();

export default function CameraNavigator() {
    return (
        <SafeAreaProvider>
            <CameraStack.Navigator
                initialRouteName="CameraScreen"
                screenOptions={{ headerShown: false, headerStyle: Styles.headerStyle }}
            >
                <CameraStack.Screen
                    name="CameraScreen"
                    component={CameraScreen}
                    options={{ headerTitle: 'Camera' }}
                />
                {/* <CameraStack.Screen
                name="NativeCmsScreen"
                component={NativeCmsScreen}
                getId={({ params }) => params.route}
            /> */}
                {/* <CameraStack.Screen
                name="Search"
                component={Search}
                getId={({ params }) => params?.query}
                options={{
                    headerShown: true,
                    headerStyle: Styles.headerStyle,
                    headerTitle: '',
                    headerLeft: (props) => <HeaderBack {...props} label="Back" />,
                }}
            /> */}
                <CameraStack.Screen
                    name="SearchSerial"
                    component={SearchSerial}
                    getId={({ params }) => params?.query}
                    options={{
                        headerShown: true,
                        headerStyle: Styles.headerStyle,
                        headerTitle: '',
                        headerLeft: (props) => <HeaderBack {...props} label="Back" />,
                    }}
                />
                {/* <CameraStack.Screen
                name="WebView"
                component={WebViewScreen}
                getId={({ params }) => params.url}
            /> */}
            </CameraStack.Navigator>
        </SafeAreaProvider>
    );
}
