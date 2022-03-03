import React, { memo, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';

import { AppState } from '@modules/redux-types';

function SyncCreateAccountErrorsFormik() {
    const error = useSelector((state: AppState) => state.user?.createUserError);
    const { setErrors } = useFormikContext();

    useEffect(() => {
        if (error && typeof error !== 'string') {
            //syncing errors from server to Formik
            setErrors(error);
        }
    }, [error, setErrors]);

    return null;
}

export default memo(SyncCreateAccountErrorsFormik);
