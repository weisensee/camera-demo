import React, { memo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';

import { APICardPage, APIContainerPage } from '@modules/api-types';
import PageElement from './PageElement';
import Layout from '@constants/Layout';

type Props = APIContainerPage & {
    tabCard?: boolean;
};

function ContainerElement({ nested_elements, tabCard, ...rest }: Props) {
    const keyExtractor = (item: APICardPage, index: number) => index.toString();

    const renderItem: ListRenderItem<APICardPage> = ({ item, index }) => (
        <PageElement key={index} {...item} tabCard={tabCard} />
    );

    const tabProps = {
        ...rest,
        nested_elements: nested_elements.map((item) => ({ ...item, tabCard })),
    };

    return (
        <FlatList
            data={tabProps.nested_elements}
            initialNumToRender={10}
            ItemSeparatorComponent={null}
            keyExtractor={keyExtractor}
            ListFooterComponentStyle={styles.footer}
            ListFooterComponent={View}
            columnWrapperStyle={Layout.TAB_CARDS_PER_ROW > 1 ? styles.columnWrapper : undefined}
            numColumns={tabCard ? Layout.TAB_CARDS_PER_ROW : Layout.TILES_PER_ROW}
            renderItem={renderItem}
            showsVerticalScrollIndicator={true}
        />
    );
}

export default memo(ContainerElement);

const styles = StyleSheet.create({
    columnWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    footer: { height: 40 },
});
