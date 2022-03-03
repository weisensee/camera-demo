import Colors from './Colors';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const width = Dimensions.get('window').width;

export default StyleSheet.create({
    black: { color: Colors.black },
    bold: { fontWeight: '700' },
    buttonContainer: { borderRadius: 5 },
    buttonStyle: {
        alignSelf: 'center',
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 30,
        paddingVertical: 5,
    },
    buttonAccentText: { color: Colors.secondary, fontWeight: 'bold' },
    buttonPrimaryText: {
        fontWeight: 'bold',
    },
    centerButton: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    centerText: { textAlign: 'center' },
    flexCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        alignSelf: 'center',
        backgroundColor: Colors.lightBackground,
        flexGrow: 1,
        minWidth: 300,
        maxWidth: 500,
        paddingBottom: 50,
    },
    headerStyle: { elevation: 0, shadowColor: 'transparent' },
    horizontalFlex: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    horizontalFlexCenter: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    horizontalFlexEnd: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    inputContainer: {
        backgroundColor: 'white',
        borderColor: Colors.lightGrey,
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        paddingVertical: 4,
        paddingHorizontal: 15,
    },
    inputLabel: { fontSize: 14, paddingBottom: 10 },
    lightBackground: { backgroundColor: Colors.lightBackground },
    searchBar: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        borderTopWidth: 0,
        height: 44,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        flexGrow: 1,
    },
    searchInput: {
        padding: 0,
        margin: 0,
        marginLeft: -5,
    },
    searchInputContainer: { backgroundColor: 'white', height: Platform.OS === 'ios' ? 40 : 44 },
    shadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 1,
                    height: 4,
                },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                zIndex: 10,
            },
            android: { elevation: 7 },
        }),
    },
    spaceAround: { justifyContent: 'space-around' },
    spacedBetween: { justifyContent: 'space-between' },
    spacedEvenly: { justifyContent: 'space-evenly' },
    tabBar: { paddingHorizontal: Math.max(width * 0.1, 40) },
    title: { fontWeight: '700' },
    underline: { textDecorationLine: 'underline' },
    uppercase: { textTransform: 'uppercase' },
    vertical: { flex: 1, flexDirection: 'column' },
});
