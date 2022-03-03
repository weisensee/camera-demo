import React, { memo, useCallback, useState } from 'react';
import { Keyboard, Platform, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import DateTimePicker, { DatePickerOptions } from '@react-native-community/datetimepicker';
import format from 'date-fns/format';

interface Props extends Omit<DatePickerOptions, 'value' | 'onChange'> {
    onChange: (date: Date) => void;
    value: Date | null;
}

// iOS spinner is shown on iOS 12 and maybe 13
const showByDefault = Platform.OS === 'ios' && parseInt(Platform.Version, 10) > 13;

function DatePicker({ onChange, value, ...rest }: Props) {
    const [show, setShow] = useState(showByDefault);

    const onChangeDate = useCallback(
        (event: any, selectedDate: Date | undefined) => {
            const currentDate = selectedDate || value || new Date();
            setShow(showByDefault);
            onChange(currentDate);
        },
        [onChange, value]
    );

    return (
        <>
            {!showByDefault ? (
                <Input
                    containerStyle={styles.input}
                    onFocus={() => {
                        setShow(true);
                        Keyboard.dismiss();
                    }}
                    value={value ? format(value, 'MM/dd/yyyy') : ''}
                />
            ) : null}
            {show ? (
                <DateTimePicker
                    {...rest}
                    onChange={onChangeDate}
                    mode="date"
                    style={styles.container}
                    value={value || new Date()}
                />
            ) : null}
        </>
    );
}

export default memo(DatePicker);

const styles = StyleSheet.create({
    container: showByDefault ? { marginTop: 10, marginBottom: 20 } : {},
    input: showByDefault ? {} : { marginTop: 10 },
});
