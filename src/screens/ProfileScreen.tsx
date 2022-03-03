import React, { memo, useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInputProps } from 'react-native';
import { Icon, Input, ListItem, Text } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, useFormikContext } from 'formik';

import GradientGrayButton from '@atoms/GradientGrayButton';
import MessageBox from '@atoms/MessageBox';
import PrimaryButton from '@atoms/PrimaryButton';
import Colors from '@constants/Colors';
import { View } from '../components/Themed';
import { InstallerOrServicerOptions } from '@components/InstallerOrServicerOptions';
import { NewPasswordForm } from '@components/NewPasswordForm';
import { ProfileAddressForm } from '@components/ProfileAddressForm';
import useUpdateProfileFormConfig from '@hooks/useUpdateProfileFormConfig';
import { AppState } from '@modules/redux-types';
import { MoreStackParamList, UpdateUserAccountOptions } from '@modules/types';
import Styles from '@modules/Styles';
import { getUserProfile } from '@modules/api';
import { setUpdateProfileError } from '@modules/actions/userActions';

type Props = StackScreenProps<MoreStackParamList, 'Profile'>;

const EDITABLE_OPTIONS: {
    key: keyof UpdateUserAccountOptions;
    label: string;
    additionalProps?: Partial<TextInputProps>;
}[] = [
    {
        key: 'firstName',
        label: 'First Name',
    },
    {
        key: 'lastName',
        label: 'Last Name',
    },
    {
        key: 'phone',
        label: 'Phone',
        additionalProps: {
            keyboardType: 'number-pad',
            textContentType: 'telephoneNumber',
        },
    },
];

const getUserRoleDescription = (role: string) =>
    role.length ? role[0].toUpperCase() + role.substr(1) : role;

export default function ProfileScreen({ route }: Props) {
    const dispatch = useDispatch();
    const isEditMode = route.params?.editMode;
    const user = useSelector((state: AppState) => state.user.user);

    const [profile, setProfile] = useState<UpdateUserAccountOptions | null>(null);

    const refreshProfile = useCallback(async () => {
        dispatch(setUpdateProfileError(''));
        const response = await getUserProfile();

        if (response.email) {
            setProfile(response);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!isEditMode) {
            refreshProfile();
        }
    }, [isEditMode, refreshProfile, user]);

    const formConfig = useUpdateProfileFormConfig(profile, refreshProfile);

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text h4 style={[Styles.title, styles.listItem]}>
                    Profile
                </Text>

                <ListItem containerStyle={styles.listItem}>
                    <Icon color={Colors.darkGrey} name="email" />
                    <ListItem.Content>
                        {/* eslint-disable-next-line react-native/no-raw-text */}
                        <ListItem.Subtitle>{'Email'}</ListItem.Subtitle>
                        <ListItem.Title>{profile?.email || user?.email}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>

                <ListItem containerStyle={styles.listItem}>
                    <Icon color={Colors.darkGrey} name="person-outline" type="iconicon" />
                    <ListItem.Content>
                        {/* eslint-disable-next-line react-native/no-raw-text */}
                        <ListItem.Subtitle>{'Role'}</ListItem.Subtitle>
                        <ListItem.Title>
                            {user && 'role' in user && user.role
                                ? getUserRoleDescription(user.role)
                                : 'Guest'}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>

                {isEditMode ? (
                    <Formik {...formConfig}>
                        {(form) => (
                            <KeyboardAwareScrollView
                                contentContainerStyle={[Styles.formContainer, styles.form]}
                                enableResetScrollToCoords={false}
                                extraScrollHeight={10}
                                keyboardShouldPersistTaps={'handled'}
                            >
                                <View>
                                    {EDITABLE_OPTIONS.map((item, i) => (
                                        <Input
                                            {...item.additionalProps}
                                            key={i}
                                            errorMessage={form.errors[item.key]}
                                            label={item.label}
                                            placeholder={item.label}
                                            onBlur={form.handleBlur(item.key)}
                                            onChangeText={form.handleChange(item.key)}
                                            value={form.values[item.key] as string | undefined}
                                        />
                                    ))}

                                    <ProfileAddressForm showLabels />

                                    {/* Options for servicers and installers only */}
                                    <InstallerOrServicerOptions
                                        role={user && 'role' in user ? user.role : undefined}
                                        showLabels
                                    />

                                    <NewPasswordForm showLabels />

                                    <SubmitActions />
                                </View>
                            </KeyboardAwareScrollView>
                        )}
                    </Formik>
                ) : null}
            </ScrollView>
        </View>
    );
}

type NavType = StackNavigationProp<MoreStackParamList, 'Profile'>;
type RouteType = RouteProp<MoreStackParamList, 'Profile'>;

const SubmitActions = memo(() => {
    const { setParams } = useNavigation<NavType>();
    const { params } = useRoute<RouteType>();
    const isEditMode = params?.editMode;
    const form = useFormikContext();

    const updateError = useSelector((state: AppState) => state.user?.profileUpdateError);

    const onCancel = useCallback(() => setParams({ editMode: false }), [setParams]);

    const onSaveChanges = useCallback(async () => {
        const isValid = await form.validateForm(form.values);
        if (isValid) {
            form.handleSubmit();
        }
    }, [form]);

    return isEditMode ? (
        <View
            style={[
                Styles.horizontalFlexCenter,
                Styles.vertical,
                Styles.spacedEvenly,
                styles.buttonsContainer,
            ]}
        >
            {updateError?.length ? <MessageBox error text={updateError} /> : null}

            <PrimaryButton
                disabled={form.isSubmitting}
                loading={form.isSubmitting}
                onPress={onSaveChanges}
                title="Save Changes"
            />
            <GradientGrayButton onPress={onCancel} title="Cancel" type="outline" />
        </View>
    ) : null;
});
SubmitActions.displayName = 'SubmitActions';

const styles = StyleSheet.create({
    buttonsContainer: { height: 150 },
    container: { flex: 1 },
    form: { backgroundColor: Colors.white },
    listItem: { paddingVertical: 20, paddingLeft: 30 },
});
