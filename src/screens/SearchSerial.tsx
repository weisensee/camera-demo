import React, { memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, ListItem, Text } from 'react-native-elements';
// import { ScrollView } from 'react-native-gesture-handler';
import useDebounce from 'react-use/lib/useDebounce';

import Colors from '../Colors';
import LoadingIndicator from '../components/atoms/LoadingIndicator';
import LoadingView from '../components/atoms/LoadingView';
import SearchBar from '../components/atoms/SearchBar';

const SEARCH_INTERVAL = 2000;

// default to Android styling to hide confusing 'Cancel' iOS button
const PLATFORM = 'android';
// const PLATFORM = ['android', 'ios'].includes(Platform.OS)
//     ? (Platform.OS as 'android' | 'ios')
//     : 'default';

type Props = {
    navigation: any;
    route: any;
};

function SearchSerial({ navigation: { push, setParams }, route }: Props) {
    const [error, setError] = useState<null | string>(null);
    const [serialData, setSerialData] = useState(null);
    const value = useMemo(() => route.params?.query.trim() || '', [route.params?.query]);

    const onChange = useCallback((text: string) => setParams({ query: text }), [setParams]);

    const [isReady, cancelFetch] = useDebounce(
        async () => {
            console.log(`[search serial] handling value: `, value);
            // try {
            //     setError(null);
            //     setSerialData(null);

            //     if (value.length) {
            //         const response = await getSerialNumberData(value);
            //         if (response.errors === null && response.serial.length) {
            //             setSerialData(response);
            //         } else {
            //             setError(`Unable to find any data for serial number: '${value}'`);
            //             console.warn(
            //                 `[refetchSerialData] unexpected response: ${JSON.stringify(response)}`
            //             );
            //         }
            //     }
            // } catch (error: any) {
            //     setError(`Unable to find any data for serial number: '${value}'`);
            //     console.warn(
            //         `[refetchSerialData] error: ${JSON.stringify(error?.message || error)}`
            //     );
            // }
        },
        SEARCH_INTERVAL,
        [value]
    );
    ``;
    return (
        <View style={styles.container}>
            {/* <ScrollView style={styles.scrollView}> */}
            <View style={styles.searchBarContainer}>
                <SearchBar
                    autoCapitalize="none"
                    autoFocus={!value.length}
                    onChangeText={onChange}
                    placeholder="Enter a Serial Number"
                    platform={PLATFORM}
                    showCancel={false}
                    value={value}
                />
                <Icon
                    color={Colors.darkGrey}
                    name="barcode-scan"
                    onPress={() => push('Scan Barcode', { disableModeSwitch: true, mode: 'scan' })}
                    type="material-community"
                />
            </View>
            {(!serialData && !error) || isReady() === false ? (
                <View style={styles.loadingContainer}>
                    {value.length ? <LoadingIndicator /> : null}
                </View>
            ) : serialData ? (
                <DisplaySerialData data={serialData} />
            ) : error ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.title}>Whoops!</Text>
                    <Text>{error}</Text>
                </View>
            ) : (
                <LoadingView />
            )}
            {/* </ScrollView> */}
        </View>
    );
}

export default memo(SearchSerial);

const renderLinkData = (item: any, index: number) => <SearchResultLink key={index} {...item} />;

const DisplaySerialData = memo(({ data }: { data: any }) => {
    return (
        <View style={styles.factsContainer}>
            <Text style={styles.itemFact}>
                {/*  eslint-disable-next-line react-native/no-raw-text */}
                {'Serial Number: '}
                <Text style={styles.regular}>{data.serial}</Text>
            </Text>
            {data?.name ? (
                <Text style={styles.itemFact}>
                    {/*  eslint-disable-next-line react-native/no-raw-text */}
                    {'Model: '}
                    <Text style={styles.regular}>{data.name}</Text>
                </Text>
            ) : null}
            {data?.product_info?.production_date ? (
                <Text style={styles.itemFact}>
                    {/*  eslint-disable-next-line react-native/no-raw-text */}
                    {'Production date: '}
                    <Text style={styles.regular}>
                        {data.product_info.production_date.toString()}
                    </Text>
                </Text>
            ) : null}
            {data.links?.map((linkData, i) =>
                'links' in linkData
                    ? linkData.links.map(renderLinkData)
                    : renderLinkData(linkData, i)
            )}
        </View>
    );
});
DisplaySerialData.displayName = 'DisplaySerialData';

const SearchResultLink = (props: SerialNumberLinkBasic) => {
    const onPress = useRouteOnPress(props);
    const [isPressed, setIsPressed] = useState(false);

    return (
        <ListItem
            bottomDivider
            containerStyle={styles.listItem}
            underlayColor={Colors.white}
            onPress={onPress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
        >
            <ListItem.Content>
                <ListItem.Title style={[styles.title, isPressed ? { color: Colors.primary } : {}]}>
                    {props.title}
                </ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    factsContainer: { paddingVertical: 30 },
    itemFact: { fontSize: 17, fontWeight: 'bold', paddingBottom: 15 },
    loadingContainer: { flex: 2 },
    listItem: { paddingVertical: 15, paddingHorizontal: 1 },
    regular: { fontWeight: '400' },
    scrollView: { paddingHorizontal: 30 },
    searchBarContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: { fontSize: 18, fontWeight: 'bold' },
});
