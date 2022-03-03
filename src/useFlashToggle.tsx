import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-elements';

import Colors from './Colors';

export default function useFlashToggle(startTransitionCamera: (onChange: () => void) => void) {
    const [flashMode, setFlashMode] = useState<'off' | 'torch'>('off');

    const switchFlashModeMode = useCallback(() => {
        startTransitionCamera(() => setFlashMode(flashMode === 'off' ? 'torch' : 'off'));
    }, [flashMode, startTransitionCamera]);

    const toggleFlashButton = useMemo(() => {
        const flashOff = flashMode === 'off';
        const textOffset = { marginRight: flashOff ? 0 : 5 };

        return (
            <Pressable style={styles.flashContainer} onPress={switchFlashModeMode}>
                <Text style={[styles.flashText, textOffset]}>{flashOff ? 'OFF' : 'ON'}</Text>
                <Icon
                    color={Colors.primary}
                    containerStyle={styles.flashIcon}
                    name={flashOff ? 'flash-outline' : 'flash'}
                    size={32}
                    type="ionicon"
                    tvParallaxProperties={undefined}
                />
            </Pressable>
        );
    }, [flashMode, switchFlashModeMode]);

    return useMemo(() => ({ flashMode, toggleFlashButton }), [flashMode, toggleFlashButton]);
}

const styles = StyleSheet.create({
    flashContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 25,
        backgroundColor: 'transparent',
    },
    flashIcon: { marginLeft: 5 },
    flashText: { fontSize: 13, color: Colors.white },
});
