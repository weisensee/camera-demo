import React, { memo, PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import Colors from '@constants/Colors';

interface Props extends PropsWithChildren<{}> {}

function ModalView({ children }: Props) {
    const navigation = useNavigation();

    return (
        <View style={styles.wrapper}>
            <View style={styles.contentContainer}>
                <Icon
                    color={Colors.darkGrey}
                    containerStyle={styles.close}
                    name={'close'}
                    onPress={() => navigation.goBack()}
                    size={34}
                    type="ionicon"
                />
                {children}
            </View>
        </View>
    );
}

export default memo(ModalView);

const styles = StyleSheet.create({
    contentContainer: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderColor: Colors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: 0,
        height: '80%',
        width: '100%',
        backgroundColor: Colors.lightBackground,
        justifyContent: 'center',
    },
    close: { alignSelf: 'flex-end', marginTop: 25, marginRight: 25, marginBottom: 5 },
    wrapper: { flex: 1, flexDirection: 'column', justifyContent: 'flex-end' },
});
