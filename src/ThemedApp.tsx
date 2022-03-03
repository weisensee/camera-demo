import React from 'react';
import { ThemeProvider } from 'react-native-elements';

import Colors from './Colors';
import SimpleErrorBoundary from './components/SimpleErrorBoundary';
import MainContentNavigator from './navigation/MainContentNavigator';
import Styles from './Styles';

const AppTheme = {
    colors: {
        primary: Colors.primary,
        secondary: Colors.secondary,
    },
    Button: {
        buttonStyle: Styles.buttonStyle,
        containerStyle: Styles.buttonContainer,
        titleStyle: [Styles.buttonPrimaryText, Styles.centerText],
    },
    Icon: {
        color: Colors.icon,
    },
    Input: {
        inputContainerStyle: [Styles.inputContainer],
        labelStyle: Styles.inputLabel,
        leftIconContainerStyle: { paddingRight: 10 },
        placeholderTextColor: Colors.grey,
    },
    SearchBar: {
        containerStyle: Styles.searchBar,
        inputStyle: Styles.searchInput,
        inputContainerStyle: Styles.searchInputContainer,
    },
    Text: { color: Colors.grey },
};

export default function ThemedApp() {
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     createAppFolders();
    //     dispatch(updateAppSettings());
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <ThemeProvider theme={AppTheme}>
            <SimpleErrorBoundary location={`Theme Level`}>
                <MainContentNavigator />
            </SimpleErrorBoundary>
        </ThemeProvider>
    );
}
