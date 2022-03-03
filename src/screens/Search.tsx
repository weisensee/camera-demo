import React, { memo } from 'react';

import FullWebView from '@atoms/FullWebView';
import { API_ROUTES } from '@modules/constants';

function Search() {
    return <FullWebView url={API_ROUTES.SEARCH_QUERY} />;
}

export default memo(Search);
