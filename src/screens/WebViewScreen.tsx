import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { HomeStackParamList } from '@modules/types';
import FullWebView from '@atoms/FullWebView';
import { getUrlFromRoute } from '@modules/api';
import { getSecureUrl } from '@modules/api-utils';

type Props = StackScreenProps<HomeStackParamList, 'WebView'>;

export default function WebViewScreen(props: Props) {
    const url = getSecureUrl(getUrlFromRoute(props.route.params.url));

    return <FullWebView url={url} />;
}
