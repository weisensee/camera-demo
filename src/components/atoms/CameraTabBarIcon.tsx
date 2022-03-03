import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import Colors from '../../Colors';

type Props = {
    focused: boolean;
    color: string;
    size: number;
};

// type NavType = CompositeNavigationProp<
//     StackNavigationProp<HomeStackParamList, keyof HomeStackParamList>,
//     HomeTabComposite
// >;

export default function CameraTabBarIcon({ focused }: Props) {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Icon
                color={Colors.primary}
                containerStyle={styles.icon}
                name="camera-outline"
                onPress={() => navigation.navigate('Camera')}
                size={30}
                raised
                reverse={focused}
                type="material-community"
                underlayColor={Colors.primary}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.lightGrey,
        borderRadius: 50,
        bottom: 15, // space from bottombar
    },
    icon: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        width: 50,
    },
});
