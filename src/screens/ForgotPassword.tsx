import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Input, Text } from 'react-native-elements';
import { StackScreenProps } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import ModalView from '@atoms/ModalView';
import PrimaryButton from '@atoms/PrimaryButton';
import VersionInfo from '@atoms/VersionInfo';
import Colors from '@constants/Colors';
import { View } from '../components/Themed';
import { forgotPassword } from '@modules/api';
import { AuthStackParamList } from '@modules/types';
import Styles from '@modules/Styles';
import { breadcrumb, logWarn } from '@modules/logging';
import MessageBox from '@atoms/MessageBox';

// @ts-ignore
const FORGOT_PASSWORD_VALIDATION = Yup.object<ForgotPasswordForm>({
    email: Yup.string().email('Email must be a valid email').required('Email is required'),
});

type ForgotPasswordForm = { email: string };

type Props = StackScreenProps<AuthStackParamList, 'ForgotPassword'>;

function ForgotPassword({ navigation: { navigate } }: Props) {
    const [error, setError] = useState('');

    const onSubmit = useCallback(
        async (values: ForgotPasswordForm) => {
            try {
                if (await form.validateForm(values)) {
                    const { email } = values;
                    const response = await forgotPassword(email).catch((err: any) => {
                        setError(`Something went wrong, please try again later.`);
                        return err;
                    });

                    if (
                        typeof response !== 'string' &&
                        'message' in response &&
                        response.message.includes('check your email')
                    ) {
                        Toast.show({
                            type: 'success',
                            text1: `Request sent!`,
                            visibilityTime: 3000,
                        });

                        // navigate to next screen
                        navigate('ResetPassword', { email });
                    } else if (typeof response !== 'string' && 'message' in response) {
                        setError(response.message);
                    } else {
                        breadcrumb('forgot password response error', 'forgot passwords', {
                            response,
                        });
                        throw new Error('submission failed');
                    }
                }
            } catch (error) {
                breadcrumb('forgot password submission error', 'forgot passwords', {
                    errorMessage: error?.message,
                });
                logWarn('Error with forgot password submission');
            }
        },
        [navigate]
    );

    const initialValues: ForgotPasswordForm = useMemo(() => ({ email: '' }), []);

    const form = useFormik({
        initialValues,
        onSubmit: onSubmit,
        validationSchema: FORGOT_PASSWORD_VALIDATION,
        validateOnBlur: true,
        validateOnChange: false,
    });

    const { errors, handleChange, handleBlur, handleSubmit, isSubmitting, isValidating, values } =
        form;

    useEffect(() => setError(''), [values.email]);

    return (
        <ModalView>
            <KeyboardAwareScrollView
                contentContainerStyle={Styles.formContainer}
                keyboardShouldPersistTaps={'handled'}
            >
                <View style={[Styles.lightBackground, styles.formContainer]}>
                    <Text
                        h3
                        style={[styles.centerText, Styles.title]}
                    >{`Forgot your password?`}</Text>
                    <Text
                        style={styles.subtitle}
                    >{`Enter your email below and we'll email you instructions on how to reset your password`}</Text>

                    <Input
                        autoCapitalize="none"
                        autoCompleteType="email"
                        containerStyle={styles.inputContainer}
                        key={`email_login`}
                        keyboardType="email-address"
                        label={`Email`}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        placeholder={`Email`}
                        textContentType="emailAddress"
                        value={values.email}
                    />

                    {error.length || errors.email?.length ? (
                        <MessageBox error text={error || errors.email} />
                    ) : null}
                </View>
                <View
                    style={[
                        Styles.lightBackground,
                        Styles.horizontalFlexCenter,
                        Styles.vertical,
                        Styles.spacedEvenly,
                        styles.buttonContainer,
                    ]}
                >
                    <PrimaryButton
                        disabled={isSubmitting || isValidating}
                        loading={isSubmitting}
                        onPress={handleSubmit as any}
                        title="Reset Password"
                    />
                </View>
                <VersionInfo center />
            </KeyboardAwareScrollView>
        </ModalView>
    );
}

const styles = StyleSheet.create({
    buttonContainer: { alignSelf: 'center', height: 100 },
    centerText: { paddingBottom: 20, textAlign: 'center' },
    formContainer: { padding: 40 },
    inputContainer: { paddingHorizontal: 0 },
    subtitle: { color: Colors.darkGrey, paddingBottom: 20, textAlign: 'center' },
});

export default memo(ForgotPassword);
