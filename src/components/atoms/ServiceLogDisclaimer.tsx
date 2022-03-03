import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import * as WebBrowser from 'expo-web-browser';

import Colors from '@constants/Colors';

const ServiceLogDisclaimer = () => (
    <View style={styles.container}>
        <Text style={styles.disclaimerText}>
            This tool is offered as a resource for homeowners and their contracted service
            representatives. Navien does not own, control, actively monitor or make any guarantees
            or representations about any content that you, any service provider or other authorized
            user may provide, create, share, disclose, originate, modify or upload to this app. For
            more information,{' '}
            <Text
                onPress={() =>
                    WebBrowser.openBrowserAsync('https://www.navieninc.com/mobile-app-eula')
                }
                style={[styles.disclaimerText, styles.disclaimerLink]}
            >
                read full End User License Agreement here.
            </Text>
        </Text>
    </View>
);

export default memo(ServiceLogDisclaimer);

const styles = StyleSheet.create({
    container: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
    disclaimerText: {
        fontSize: 10.5,
        lineHeight: 13.5,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    disclaimerLink: {
        color: Colors.secondary,
        fontStyle: 'italic',
        textDecorationLine: 'underline',
    },
});
