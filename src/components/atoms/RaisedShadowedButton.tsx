import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import Colors from '../../Colors';

type Props = {
    iconName: string;
    label: string;
    onPress: () => void;
};

export default function RaisedShadowedButton({ iconName, label, onPress }: Props) {
    const [pressed, setPressed] = useState(false);

    const borderStyle = pressed ? { backgroundColor: Colors.lightGrey } : undefined;

    return (
        <View>
            <Pressable onPress={onPress} style={[styles.iconContainer, borderStyle]}>
                <Icon
                    color={pressed ? '#fb6b0450' : Colors.primary}
                    containerStyle={styles.icon}
                    name={iconName}
                    reverse
                    onPress={onPress}
                    onPressIn={() => setPressed(true)}
                    onPressOut={() => setPressed(false)}
                    size={40}
                    type="material-community"
                />
            </Pressable>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignSelf: 'center',
        backgroundColor: Colors.white,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { height: 1, width: 1 },
        elevation: 15,
        width: 85,
        height: 85,
        borderRadius: 50,
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        width: 70,
    },
    label: { marginTop: 10, fontSize: 20 },
});
