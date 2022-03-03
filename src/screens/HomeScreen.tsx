import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { API_PAGE_ROUTES } from '@modules/constants';
import { updatePageContents } from '@modules/actions/pageActions';
import OfflineSuspenseWrapper from '@components/OfflineSuspenseWrapper';
import SiteContent from '@components/SiteContent';

// type Props = StackScreenProps<HomeStackParamList, 'Home'>;

export default function HomeScreen() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updatePageContents(API_PAGE_ROUTES.HOME_PAGE));
    }, [dispatch]);

    return (
        <OfflineSuspenseWrapper>
            <SiteContent route={API_PAGE_ROUTES.HOME_PAGE} />
        </OfflineSuspenseWrapper>
    );
}
