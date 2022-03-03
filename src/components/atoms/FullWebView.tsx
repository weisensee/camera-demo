import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import {
    FileDownloadEvent,
    WebViewErrorEvent,
    WebViewHttpErrorEvent,
} from 'react-native-webview/lib/WebViewTypes';
import * as FileSystem from 'expo-file-system';

import {
    API_ROUTES,
    DOWNLOADS_FILE_PATH,
    getCookieHeader,
    WEB_PAGE_HEADER,
} from '@modules/constants';
import LoadingView from './LoadingView';
import WebviewError from './WebviewError';
import { getFilenameFromUrl, removeInternalLinkPrefix } from '@modules/api-utils';
import { breadcrumb, logWarn } from '@modules/logging';
import { checkShareable, shareLocalFile } from '@modules/sharing';
import { WebViewNavigationProp } from '@modules/types';
import { useCheckServiceLogRedirect } from '@modules/service-logs';

// newNavState looks something like this:
type NavState = {
    url?: string;
    title?: string;
    loading?: boolean;
    canGoBack?: boolean;
    canGoForward?: boolean;
    navigationType?: string; // (iOS only)
    target?: any;
};

interface Props {
    style?: ViewStyle;
    url: string;
}

const isNewPageUrl = (url: string): boolean =>
    !url.toLowerCase().includes('.dwg') &&
    !url.toLowerCase().endsWith('/download') &&
    !url.toLowerCase().includes('.pdf?sha=') &&
    !url.toLowerCase().includes('iframe') &&
    !url.toLowerCase().includes('about:blank') &&
    !url.toLowerCase().includes('youtube.com');

const isAjaxRequest = (currentUrl: string, newUrl: string): boolean => {
    const isFilterRequest =
        currentUrl.endsWith('/downloads') && newUrl.endsWith('downloads/filter');
    const isOnlyParamsChange =
        newUrl.includes(currentUrl) || newUrl.split('?')[0].includes(currentUrl.split('?')[0]);
    return isFilterRequest || isOnlyParamsChange;
};

const isSearchResult = (currentUrl: string, newUrl: string): boolean => newUrl.includes('/search');

export default function FullWebView({ style, url }: Props) {
    const webViewRef = useRef<WebView>(null);
    const { navigate } = useNavigation<WebViewNavigationProp>();
    const headers = useMemo(() => ({ ...WEB_PAGE_HEADER, ...getCookieHeader(true) }), []);
    const checkServiceLogRedirect = useCheckServiceLogRedirect();

    const onNavigationStateChange = useCallback(
        (newNavState: NavState) => {
            const { title, url: newUrl } = newNavState;
            breadcrumb(`[onNavigationStateChange] title: ${title}, url: ${newUrl}`, 'navigation', {
                newNavState,
            });
            if (!newUrl) return true;

            // redirect somewhere else
            if (newUrl.includes('navien://')) {
                if (checkShareable(newUrl, title || '')) {
                    // opens sharing modal automatically
                } else if (checkServiceLogRedirect(newUrl, title || '')) {
                    // re-routes to service logs automatically
                } else {
                    navigate('NativeCmsScreen', {
                        title: newNavState.title || '',
                        route: `${API_ROUTES.REROUTE_PAGES}${removeInternalLinkPrefix(newUrl)}`,
                    });
                }
                return false;
            } else if (url === newUrl) {
                return true;
            } else if (isAjaxRequest(url, newUrl)) {
                return false;
            }

            if (isNewPageUrl(newUrl)) {
                navigate('WebView', { title: newNavState.title || '', url: newUrl });
            }
            return false;
        },
        [checkServiceLogRedirect, navigate, url]
    );

    const onShouldStartLoadWithRequest = useCallback(
        (newNavState: NavState) => {
            const { title, url: newUrl } = newNavState;
            breadcrumb(
                `[onShouldStartLoadWithRequest] title: ${title}, url: ${newUrl}`,
                'navigation',
                {
                    //  newNavState
                }
            );
            if (!newUrl) return true;

            // redirect somewhere else
            if (newUrl.includes('navien://')) {
                if (checkShareable(newUrl, title || '')) {
                    // opens sharing modal automatically
                } else if (checkServiceLogRedirect(newUrl, title || '')) {
                    // re-routes to service logs automatically
                } else {
                    navigate('NativeCmsScreen', {
                        title: newNavState.title || '',
                        route: `${API_ROUTES.REROUTE_PAGES}${removeInternalLinkPrefix(newUrl)}`,
                    });
                }
                return false;
            } else if (url === newUrl) {
                return true;
            } else if (isAjaxRequest(url, newUrl)) {
                return true;
            }

            if (isNewPageUrl(newUrl)) {
                navigate('WebView', { title: newNavState.title || '', url: newUrl });
            }
            return !isNewPageUrl(newUrl);
        },
        [checkServiceLogRedirect, navigate, url]
    );

    const onError = useCallback((syntheticEvent: WebViewErrorEvent) => {
        syntheticEvent.preventDefault();
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
    }, []);

    const onHTTPError = useCallback((syntheticEvent: WebViewHttpErrorEvent) => {
        syntheticEvent.preventDefault();
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView HTTP error: ', nativeEvent);
    }, []);

    const onFileDownload = useCallback(
        ({ nativeEvent: { downloadUrl } }: FileDownloadEvent) => {
            try {
                Toast.show({
                    type: 'info',
                    text1: `Downloading file...`,
                    visibilityTime: 10000,
                });

                FileSystem.downloadAsync(
                    downloadUrl,
                    DOWNLOADS_FILE_PATH +
                        Date.now().toString() +
                        '_' +
                        getFilenameFromUrl(downloadUrl),
                    // @ts-ignore headers type mismatch
                    { headers }
                ).then(({ uri }) => {
                    Toast.show({
                        type: 'success',
                        text1: `Success!`,
                        text2: `Download complete.`,
                        visibilityTime: 3000,
                    });

                    shareLocalFile(uri);
                });
            } catch (error) {
                logWarn(error.message);
            }
        },
        [headers]
    );

    return (
        <WebView
            ref={webViewRef}
            onError={onError}
            onHttpError={onHTTPError}
            onNavigationStateChange={onNavigationStateChange}
            originWhitelist={['http://', 'https://', 'navien://', 'navien:///']}
            onFileDownload={onFileDownload}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            renderLoading={LoadingView}
            renderError={WebviewError}
            setSupportMultipleWindows={false}
            source={{ headers, uri: url }}
            startInLoadingState // start web views in a loading state as requested
            style={[StyleSheet.absoluteFill, style || {}]}
        />
    );
}
