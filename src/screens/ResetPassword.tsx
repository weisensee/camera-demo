import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Icon, Input, Text } from 'react-native-elements';
import { StackScreenProps } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import MessageBox from '@atoms/MessageBox';
import ModalView from '@atoms/ModalView';
import PrimaryButton from '@atoms/PrimaryButton';
import VersionInfo from '@atoms/VersionInfo';
import Colors from '@constants/Colors';
import { View } from '../components/Themed';
import { resetPassword } from '@modules/api';
import { AuthStackParamList } from '@modules/types';
import Styles from '@modules/Styles';
import { breadcrumb, logWarn } from '@modules/logging';

const RESET_PASSWORD_VALIDATION = Yup.object({
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    token: Yup.string().required('Token is required'),
});

type ResetPasswordForm = { password: string; token: string };

type Props = StackScreenProps<AuthStackParamList, 'ResetPassword'>;

function ResetPassword({ navigation: { goBack, navigate }, route }: Props) {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const email = useMemo(() => route.params.email, []);

    const onSubmit = useCallback(
        async (values: ResetPasswordForm) => {
            try {
                if (await form.validateForm(values)) {
                    const { password, token } = values;
                    const response = await resetPassword(password, token);

                    if (
                        typeof response !== 'string' &&
                        'message' in response &&
                        response.message.includes('success')
                    ) {
                        Toast.show({
                            type: 'success',
                            text1: `Success!`,
                            text2: response.message,
                            visibilityTime: 3000,
                        });

                        form.resetForm();

                        // navigate to next screen
                        navigate('Login');
                    } else if (
                        typeof response !== 'string' &&
                        'message' in response &&
                        response.message.includes('Token not valid')
                    ) {
                        Toast.show({
                            type: 'error',
                            text1: `Whoops!`,
                            text2: response.message,
                            visibilityTime: 4000,
                        });
                        goBack();
                    } else {
                        breadcrumb('reset password response error', 'reset password', {
                            response,
                        });
                        throw new Error('submission failed');
                    }
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: `Whoops!`,
                    text2: `Something went wrong, please try again later.`,
                    visibilityTime: 3000,
                });
                breadcrumb('reset password submission error', 'reset password', {
                    errorMessage: error?.message,
                });
                logWarn('Error with reset password submission');
            }
        },
        [navigate]
    );

    const initialValues: ResetPasswordForm = useMemo(() => ({ password: '', token: '' }), []);

    const form = useFormik({
        initialValues,
        onSubmit: onSubmit,
        validationSchema: RESET_PASSWORD_VALIDATION,
        validateOnBlur: false,
        validateOnChange: false,
    });

    const { errors, handleChange, handleBlur, handleSubmit, isSubmitting, isValidating, values } =
        form;

    useEffect(() => form.setErrors({}), [values]);

    const passwordIcon = useMemo(
        () => (
            <Icon
                color={Colors.secondary}
                name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                onPress={() => setPasswordVisible(!passwordVisible)}
                type="ionicon"
            />
        ),
        [passwordVisible]
    );

    return (
        <ModalView>
            <KeyboardAwareScrollView
                contentContainerStyle={Styles.formContainer}
                keyboardShouldPersistTaps={'handled'}
            >
                <View style={[Styles.lightBackground, styles.formContainer]}>
                    <Text h3 style={[styles.centerText, Styles.title]}>{`Password Recovery`}</Text>
                    <Text style={styles.subtitle}>
                        {`If we found a user with email address `}
                        <Text style={Styles.bold}>{email}</Text>
                        {` in our system, you will receive and email from us shortly.`}
                    </Text>
                    <Text style={styles.subtitle}>
                        {`If you do not receive the email within a few minutes, please check your junk/spam email folder.`}
                    </Text>
                    <Text style={styles.subtitle}>
                        {`Unsure which email you used for your account, or not sure what account you are associated with? Contact us`}
                    </Text>
                    <Input
                        autoCorrect={false}
                        autoCapitalize="none"
                        autoCompleteType="off"
                        containerStyle={styles.inputContainer}
                        key={`token`}
                        keyboardType="default"
                        label={`Token`}
                        onChangeText={handleChange('token')}
                        onBlur={handleBlur('token')}
                        placeholder={`Token`}
                        textContentType="none"
                        value={values.token}
                    />
                    {errors.token?.length ? <MessageBox error text={errors.token} /> : null}

                    <Input
                        key={`password`}
                        rightIcon={passwordIcon}
                        placeholder={`Password`}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        secureTextEntry={!passwordVisible}
                        textContentType="password"
                        value={values.password}
                    />
                    {errors.password?.length ? <MessageBox error text={errors.password} /> : null}
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

export default memo(ResetPassword);
