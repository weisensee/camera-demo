import React from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from 'react-native-elements';

import { MoreStackParamList } from '@modules/types';
import Colors from '@constants/Colors';

interface Props {
    editing: boolean;
    navigation: StackNavigationProp<MoreStackParamList, keyof MoreStackParamList>;
}

export default function HeaderEdit(props: Props) {
    const { editing, navigation } = props;

    const buttonText = editing ? 'Cancel' : 'Edit';
    const iconName = editing ? 'close' : 'edit';
    const onPress = () => navigation.navigate('Profile', { editMode: !editing });

    return (
        <Button
            buttonStyle={[styles.button]}
            icon={{ color: Colors.darkestGrey, name: iconName, type: 'material', size: 18 }}
            iconRight
            onPress={onPress}
            title={buttonText}
            titleStyle={styles.title}
            type="clear"
        />
    );
}

const styles = StyleSheet.create({
    button: { paddingHorizontal: 10 },
    title: { color: Colors.darkestGrey },
});
