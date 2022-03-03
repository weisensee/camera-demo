import React, { memo } from 'react';

import Layout from '@constants/Layout';
import { APICardPage } from '@modules/api-types';
import { getImage, getTitle } from '@modules/api-utils';
import SquareTileButton from './SquareTileButton';
import useRouteOnPress from '@hooks/useRouteOnPress';

function PageItemCard({ contents }: APICardPage) {
    const image = getImage(contents);
    const title = getTitle(contents);
    const onPress = useRouteOnPress(contents);

    return (
        <SquareTileButton onPress={onPress} width={Layout.TILE_WIDTH} image={image} title={title} />
    );
}

export default memo(PageItemCard);
