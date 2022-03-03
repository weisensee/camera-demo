import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { APIContainerPage, APIPageList } from '@modules/api-types';
import PageElement from './PageElement';

function PageList({ nested_elements }: APIPageList | APIContainerPage) {
    return (
        <>
            {nested_elements.map((value, index) => (
                <PageElement key={index} {...value} />
            ))}
            <View style={styles.padding} />
        </>
    );
}

export default memo(PageList);

const styles = StyleSheet.create({
    padding: { height: 50 },
});
