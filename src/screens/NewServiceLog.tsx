import React, { memo, useCallback, useMemo } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Chip, Icon, Input, Text } from 'react-native-elements';
import { useIsConnected } from 'react-native-offline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import PickerSelect from 'react-native-picker-select';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import useLatest from 'react-use/lib/useLatest';
import Toast from 'react-native-toast-message';
import endOfDay from 'date-fns/endOfDay';

import ClearButton from '@atoms/ClearButton';
import DatePicker from '@atoms/DatePicker';
import InputLabel from '@atoms/InputLabel';
import MessageBox from '@atoms/MessageBox';
import PrimaryButton from '@atoms/PrimaryButton';
import ImageList from '@components/ImageList';
import { View } from '@components/Themed';
import Colors from '@constants/Colors';
import { addSerialServiceLog } from '@modules/actions/serviceLogsActions';
import { ServiceLogEntry } from '@modules/api-types';
import { base64ToImageSource, base64ToImageString, convertLogImageUrls } from '@modules/api-utils';
import { createServiceLog } from '@modules/api';
import { IMAGE_PICKER_OPTIONS } from '@modules/constants';
import { AppState } from '@modules/redux-types';
import Styles from '@modules/Styles';
import {
    NewServiceLogEntry,
    NewServiceLogNavigationProp,
    NewServiceLogRouteProp,
} from '@modules/types';
import { breadcrumb, logWarn } from '@modules/logging';

const SERVICE_LOG_SCHEMA = Yup.object({
    comment: Yup.string().when('images', (images: string[]) => {
        if (!images?.length) {
            return Yup.string().nullable().required('Service comment or image is required');
        }
        return Yup.string();
    }),
    date: Yup.date().required('Service date is required'),
    images: Yup.array().of(Yup.string()),
    serialNumber: Yup.string().required('Serial Number is required'),
    serviceType: Yup.string().nullable().required('Service Category is required'),
});

const getImagePickerLibraryPermission = async (): Promise<boolean> => {
    const permissions = await ImagePicker.getMediaLibraryPermissionsAsync();
    return permissions.granted || (await ImagePicker.requestMediaLibraryPermissionsAsync()).granted;
};

const getImagePickerPhotoPermission = async (): Promise<boolean> => {
    const permissions = await ImagePicker.getCameraPermissionsAsync();
    return permissions.granted || (await ImagePicker.requestCameraPermissionsAsync()).granted;
};

type Props = {
    navigation: NewServiceLogNavigationProp;
    route: NewServiceLogRouteProp;
};

function NewServiceLog({ navigation, route }: Props) {
    const isConnected = useIsConnected();
    const dispatch = useDispatch();
    const { goBack, setParams } = navigation;
    const optional = !!route.params?.optional;
    const serialNumber = route.params?.serialNumber;

    const onDecline = useCallback(() => {
        if (hasMultipleSerialNumbers(serialNumber)) {
            setParams({ serialNumber: serialNumber.substring(serialNumber.indexOf(',') + 1) });
        } else {
            goBack();
        }
    }, [goBack, serialNumber, setParams]);

    const serviceTypes = useSelector((state: AppState) => state.app.serviceTypes);

    const addServiceLog = useCallback(
        (values: ServiceLogEntry) =>
            dispatch(
                addSerialServiceLog(
                    getCurrentSerialNumber(serialNumber),
                    convertLogImageUrls(values)
                )
            ),
        [dispatch, serialNumber]
    );

    const onSubmit = useCallback(
        async (values: NewServiceLogEntry) => {
            try {
                if (!isConnected) {
                    Alert.alert(
                        'Offline',
                        "Sorry, it looks like you're offline. Try connecting to the internet and trying again.",
                        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
                    );
                } else {
                    const response = await createServiceLog(values);

                    if (typeof response !== 'string' && 'id' in response && response.id) {
                        addServiceLog(response);

                        Toast.show({
                            type: 'success',
                            text1: `New Service Logged!`,
                            text2: `${response.comment.substring(0, 30)}${
                                response.comment.length > 30 ? `...` : ''
                            }`,
                            visibilityTime: 3000,
                        });

                        goBack();
                    } else {
                        throw new Error('submission failed');
                    }
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: `Submission failed.`,
                    text2: `Please adjust the log and try again`,
                    visibilityTime: 3000,
                });

                breadcrumb('service log submission error', 'service logs', {
                    errorMessage: error?.message,
                });
                logWarn('Error with service log submission');
            }
        },
        [addServiceLog, goBack, isConnected]
    );

    const initialValues: NewServiceLogEntry = useMemo(
        () => ({
            comment: '',
            date: new Date(),
            images: [],
            serialNumber: getCurrentSerialNumber(serialNumber),
            serviceType: null,
        }),
        [serialNumber]
    );

    const form = useFormik({
        initialValues,
        onSubmit,
        validationSchema: SERVICE_LOG_SCHEMA,
        validateOnBlur: false,
        validateOnChange: false,
    });

    const {
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        validateForm,
        values,
    } = form;

    const onPressSubmit = useCallback(async () => {
        const validation = await validateForm(values);
        if (!validation || !Object.keys(validation).length) {
            handleSubmit();
        }
    }, [handleSubmit, validateForm, values]);

    const addImagesToServiceLog = useLatest(async (assets: ImageInfo[]) => {
        const base64Images = assets
            .filter((asset) => asset.base64?.length)
            .map((asset) => (asset.base64 ? base64ToImageString(asset.base64) : ''));

        setFieldValue('images', [...base64Images, ...values.images]);
    }).current;

    const addFromLibrary = useCallback(async () => {
        const permissionGranted = await getImagePickerLibraryPermission();
        if (permissionGranted) {
            const results = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);
            if (!results.cancelled) {
                // @ts-ignore sometimes this happens, single select image on iPhone
                if ('base64' in results && results.base64?.length) {
                    addImagesToServiceLog([results]);
                }
                if ('selected' in results && results.selected?.length) {
                    addImagesToServiceLog(results.selected);
                }
            } else {
                Alert.alert('Library access permissions required to attach photos');
            }
        }
    }, [addImagesToServiceLog]);

    const takePhoto = useCallback(async () => {
        const permissionGranted = await getImagePickerPhotoPermission();
        if (permissionGranted) {
            const results = await ImagePicker.launchCameraAsync(IMAGE_PICKER_OPTIONS);
            if (!results.cancelled && results.base64) {
                addImagesToServiceLog([results]);
            }
        } else {
            Alert.alert('Camera permissions required to take photos');
        }
    }, [addImagesToServiceLog]);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView
                enableResetScrollToCoords={false}
                extraScrollHeight={50}
                keyboardShouldPersistTaps={'handled'}
                style={styles.scrollView}
            >
                <Text h3 style={styles.titleText}>
                    Add new service entry
                </Text>

                <MultiSerialNumberBreadcrumbs serialNumber={serialNumber} />

                {/* eslint-disable-next-line react-native/no-raw-text */}
                <InputLabel style={styles.dateLabel}>{'Date:'}</InputLabel>
                <DatePicker
                    maximumDate={endOfDay(new Date())}
                    onChange={(newDate: Date) => setFieldValue('date', newDate)}
                    value={values.date}
                />

                <PickerSelect
                    items={serviceTypes}
                    onValueChange={handleChange('serviceType')}
                    placeholder={{ label: 'Choose service category', value: null }}
                    value={values.serviceType}
                    style={{
                        placeholder: styles.placeholderText,
                        inputAndroid: styles.placeholderText,
                        inputIOS: styles.placeholderText,
                        viewContainer: styles.picker,
                    }}
                />

                <Input
                    containerStyle={styles.inputContainer}
                    multiline
                    numberOfLines={3}
                    onChangeText={handleChange('comment')}
                    onBlur={handleBlur('comment')}
                    placeholder={'Add Comments'}
                    textContentType="none"
                    value={values.comment}
                />

                <View style={Styles.horizontalFlex}>
                    <ClearButton
                        icon={
                            <Icon color={Colors.primary} name="camera" type="material-community" />
                        }
                        onPress={takePhoto}
                        title="Take Picture"
                        titleStyle={styles.buttonTitle}
                    />
                    <ClearButton
                        icon={<Icon color={Colors.primary} name="photo-library" type="material" />}
                        onPress={addFromLibrary}
                        title="Add from library"
                        titleStyle={styles.buttonTitle}
                    />
                </View>

                <ImageList images={values.images.map(base64ToImageSource)} />

                {Object.keys(errors)?.length ? (
                    <MessageBox
                        error
                        style={styles.errorBox}
                        text={(Object.keys(errors) as (keyof NewServiceLogEntry)[]).reduce(
                            (prev, cur) => (errors[cur] ? prev + errors[cur] + '\n' : prev),
                            ''
                        )}
                    />
                ) : null}

                <PrimaryButton
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    onPress={onPressSubmit}
                    title="Add log"
                />
                <ClearButton
                    disabled={isSubmitting}
                    onPress={onDecline}
                    title={optional ? 'Skip' : 'Cancel'}
                    titleStyle={styles.textLink}
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

export default memo(NewServiceLog);

const hasMultipleSerialNumbers = (serialNumber: string): boolean =>
    !!(serialNumber.length && serialNumber.split(',').length > 1);

const getCurrentSerialNumber = (serialNumber: string): string =>
    hasMultipleSerialNumbers(serialNumber) ? serialNumber.split(',')[0] : serialNumber;

const MultiSerialNumberBreadcrumbs = memo(({ serialNumber }: { serialNumber: string }) => {
    const multipleSerialNumbers = hasMultipleSerialNumbers(serialNumber);

    if (multipleSerialNumbers) {
        const serials = serialNumber.split(',');

        return (
            <View style={styles.breadcrumbContainer}>
                {serials.map((serial, i) => {
                    const buttonStyle =
                        i === 0
                            ? { paddingHorizontal: 10, paddingVertical: 5 }
                            : { paddingHorizontal: 5, paddingVertical: 4 };
                    const titleStyle = i === 0 ? { fontSize: 14 } : { fontSize: 12 };

                    return (
                        <>
                            <Chip
                                key={i}
                                buttonStyle={buttonStyle}
                                containerStyle={styles.chipContainer}
                                type={i === 0 ? 'solid' : 'outline'}
                                title={serial}
                                titleStyle={titleStyle}
                            />
                            {i < serials.length - 1 ? (
                                <Icon
                                    containerStyle={styles.chipContainer}
                                    name="chevron-thin-right"
                                    color={Colors.primary}
                                    size={16}
                                    type={'entypo'}
                                />
                            ) : null}
                        </>
                    );
                })}
            </View>
        );
    }
    return null;
});
MultiSerialNumberBreadcrumbs.displayName = 'MultiSerialNumberBreadcrumbs';

const styles = StyleSheet.create({
    breadcrumbContainer: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        marginBottom: 20,
    },
    buttonTitle: { color: Colors.text, fontWeight: 'normal', paddingLeft: 5 },
    chipContainer: { marginRight: 5 },
    container: {
        backgroundColor: Colors.background,
        flex: 1,
        justifyContent: 'center',
    },
    dateLabel: Platform.select({ android: { marginBottom: 5 }, ios: { marginBottom: -20 } }) || {},
    errorBox: { marginTop: 20 },
    inputContainer: { paddingHorizontal: 0 },
    picker: {
        marginBottom: Platform.select({ android: 20, ios: 20 }),
        marginTop: Platform.select({ android: 0, ios: 20 }),
        paddingVertical: Platform.select({ android: 5, ios: 20 }),
        borderColor: Colors.lightGrey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
    },
    placeholderText: { color: Colors.darkestGrey, paddingLeft: 15 },
    scrollView: { paddingHorizontal: 30 },
    textLink: { color: Colors.secondary },
    titleText: { fontWeight: 'bold', marginBottom: 20 },
});
