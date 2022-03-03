import React, { memo } from 'react';

import {
    APICardPage,
    APIContainerPage,
    APIPageElement,
    APIPageHeader,
    APIPageLinks,
    APIPageList,
} from '@modules/api-types';
import { PAGE_ELEMENT } from '@modules/constants';
import ContainerElement from './ContainerElement';
import PageItemCard from './PageItemCard';
import PageHeader from './PageHeader';
import PageLink from './PageLink';
import PageList from './PageList';
import TabItemCard from './TabItemCard';

type Props = APIPageElement & {
    tabCard?: boolean;
};

function PageElement(props: Props) {
    const { tabCard, type } = props;

    if (type === PAGE_ELEMENT.CARD) {
        if (tabCard) {
            return <TabItemCard {...(props as APICardPage)} />;
        }
        return <PageItemCard {...(props as APICardPage)} />;
    } else if (type === PAGE_ELEMENT.CONTAINER) {
        return <ContainerElement {...(props as APIContainerPage)} />;
    } else if (type === PAGE_ELEMENT.HEADER) {
        return <PageHeader {...(props as APIPageHeader)} />;
    } else if (type === PAGE_ELEMENT.LINK) {
        return <PageLink {...(props as APIPageLinks)} />;
    } else if (type === PAGE_ELEMENT.LIST) {
        return <PageList {...(props as APIPageList)} />;
    } else {
        console.log(`PageElement unknown type: [${type}]`);
        return null;
    }
}

export default memo(PageElement);
