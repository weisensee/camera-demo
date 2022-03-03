import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Icon, Input, Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik, useFormikContext } from 'formik';

import ClearButton from '@atoms/ClearButton';
import InputLabel from '@atoms/InputLabel';
import MessageBox from '@atoms/MessageBox';
import ModalView from '@atoms/ModalView';
import PrimaryButton from '@atoms/PrimaryButton';
import SyncCreateAccountErrorsFormik from '@atoms/SyncCreateAccountErrorsFormik';
import VersionInfo from '@atoms/VersionInfo';
import { InstallerOrServicerOptions } from '@components/InstallerOrServicerOptions';
import { ProfileAddressForm } from '@components/ProfileAddressForm';
import { View } from '../components/Themed';
import Colors from '@constants/Colors';
import useCreateAccountFormConfig from '@hooks/useCreateAccountFormConfig';
import { USER_ROLES } from '@modules/constants';
import Styles from '@modules/Styles';
import { setCreateUserError } from '@modules/actions/userActions';
import { AppState } from '@modules/redux-types';
import { AuthStackParamList, CreateUserAccountOptions } from '@modules/types';

// type Props = StackScreenProps<AuthStackParamList, 'CreateAccount'>;

function CreateAccountScreen() {
    const dispatch = useDispatch();
    const error = useSelector((state: AppState) => state.user?.createUserError);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const formConfig = useCreateAccountFormConfig();

    useEffect(() => {
        dispatch(setCreateUserError(''));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            <Formik {...formConfig}>
                {({ errors, handleBlur, handleChange, values }) => (
                    <KeyboardAwareScrollView
                        contentContainerStyle={[Styles.formContainer]}
                        enableResetScrollToCoords={false}
                        extraScrollHeight={10}
                        keyboardOpeningTime={0}
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View style={Styles.lightBackground}>
                            <SyncCreateAccountErrorsFormik />

                            <Input
                                autoCapitalize="none"
                                autoCompleteType="email"
                                errorMessage={errors?.email}
                                key={`email`}
                                keyboardType="email-address"
                                onBlur={handleBlur('email')}
                                onChangeText={handleChange('email')}
                                placeholder={`Email`}
                                textContentType="emailAddress"
                                value={values.email}
                            />

                            <Input
                                key={`password`}
                                errorMessage={errors.password}
                                rightIcon={passwordIcon}
                                placeholder={`Password`}
                                onBlur={handleBlur('password')}
                                onChangeText={handleChange('password')}
                                secureTextEntry={!passwordVisible}
                                textContentType="password"
                                value={values.password}
                            />

                            <Input
                                key={`passwordConfirmation`}
                                errorMessage={errors.passwordConfirmation}
                                rightIcon={passwordIcon}
                                placeholder={`Confirm password`}
                                onBlur={handleBlur('passwordConfirmation')}
                                onChangeText={handleChange(`passwordConfirmation`)}
                                secureTextEntry={!passwordVisible}
                                textContentType="password"
                                value={values.passwordConfirmation}
                            />

                            <Input
                                key={`firstName`}
                                errorMessage={errors.firstName}
                                placeholder={`First Name`}
                                onBlur={handleBlur('firstName')}
                                onChangeText={handleChange('firstName')}
                                value={values.firstName}
                            />

                            <Input
                                key={`lastName`}
                                errorMessage={errors.lastName}
                                placeholder={`Last Name`}
                                onBlur={handleBlur('lastName')}
                                onChangeText={handleChange('lastName')}
                                value={values.lastName}
                            />

                            <Input
                                key={`phone`}
                                errorMessage={errors.phone}
                                keyboardType="number-pad"
                                onBlur={handleBlur('phone')}
                                onChangeText={handleChange('phone')}
                                placeholder={`Phone`}
                                textContentType="telephoneNumber"
                                value={values.phone}
                            />

                            <Input
                                key={`companyName`}
                                errorMessage={errors.companyName}
                                placeholder={`Company`}
                                onBlur={handleBlur('companyName')}
                                onChangeText={handleChange('companyName')}
                                value={values.companyName}
                            />

                            {values.role ? (
                                // eslint-disable-next-line react-native/no-raw-text
                                <InputLabel>{'Role'}</InputLabel>
                            ) : null}

                            <PickerSelect
                                items={USER_ROLES.map((roleType) => ({
                                    label: roleType,
                                    value: roleType.toLocaleLowerCase(),
                                }))}
                                onValueChange={handleChange('role')}
                                placeholder={{ label: 'Select Role', value: '' }}
                                value={values.role}
                                style={{
                                    placeholder: styles.placeholderText,
                                    inputAndroid: styles.placeholderText,
                                    inputIOS: styles.placeholderText,
                                    viewContainer: styles.picker,
                                }}
                            />

                            {errors.role ? <MessageBox error text={errors.role} /> : null}

                            <ProfileAddressForm />

                            {/* Options for servicers and installers only */}
                            <InstallerOrServicerOptions role={values.role} />

                            {error && typeof error === 'string' && error?.length ? (
                                <MessageBox error text={error} />
                            ) : errors &&
                              (Object.keys(errors) as (keyof CreateUserAccountOptions)[]).some(
                                  (key) => !!errors[key]
                              ) ? (
                                <MessageBox
                                    error
                                    style={styles.errorBox}
                                    text={'Please fix errors above'}
                                />
                            ) : null}
                        </View>
                        <SubmitActions />
                        <VersionInfo center />
                    </KeyboardAwareScrollView>
                )}
            </Formik>
        </ModalView>
    );
}

type NavType = StackNavigationProp<AuthStackParamList, keyof AuthStackParamList>;

const SubmitActions = memo(() => {
    const { replace } = useNavigation<NavType>();
    const form = useFormikContext();

    const onGoLogin = useCallback(() => replace('Login'), [replace]);

    const onCreate = useCallback(async () => {
        const validation = await form.validateForm(form.values);
        if (!validation || !Object.keys(validation).length) {
            form.handleSubmit();
        }
    }, [form]);

    return (
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
                disabled={form.isSubmitting}
                loading={form.isSubmitting}
                onPress={onCreate}
                title="Create"
            />
            <Text style={styles.centerText}>{`Already have an account?`}</Text>
            <ClearButton
                onPress={onGoLogin}
                title="Log in here"
                titleStyle={[styles.centerText, styles.loginAccountLink]}
            />
        </View>
    );
});
SubmitActions.displayName = 'SubmitActions';

const styles = StyleSheet.create({
    buttonContainer: { height: 120 },
    centerText: { paddingTop: 15, textAlign: 'center' },
    errorBox: { marginTop: 20 },
    loginAccountLink: { color: Colors.secondary, fontSize: 18, fontWeight: '700' },
    picker: {
        marginBottom: Platform.select({ android: 20, ios: 20 }),
        marginTop: Platform.select({ android: 0, ios: 20 }),
        paddingVertical: Platform.select({ android: 5, ios: 20 }),
        borderColor: Colors.lightGrey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
    },
    placeholderText: { color: Colors.darkestGrey, fontWeight: 'bold', textAlign: 'center' },
});

export default memo(CreateAccountScreen);
