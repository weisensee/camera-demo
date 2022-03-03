import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import Colors from '../../Colors';

export default function LoadingIndicator(props: ActivityIndicatorProps) {
    return <ActivityIndicator size="large" color={Colors.secondary} {...props} />;
}
