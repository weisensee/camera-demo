import React, { Component, memo } from 'react';
import { StyleSheet } from 'react-native';
import { Icon, Input, Text } from 'react-native-elements';
import { StackScreenProps } from '@react-navigation/stack';
import { bindActionCreators } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { View } from '../components/Themed';
import { AppState, ThunkDispatch } from '@modules/redux-types';
import { AuthStackParamList } from '@modules/types';
import Colors from '@constants/Colors';
import Styles from '@modules/Styles';
import { login, setLoginUserError } from '@modules/actions/userActions';
import VersionInfo from '@atoms/VersionInfo';
import PrimaryButton from '@atoms/PrimaryButton';
import ModalView from '@atoms/ModalView';
import ClearButton from '@atoms/ClearButton';
import MessageBox from '@atoms/MessageBox';

type Props = StackScreenProps<AuthStackParamList, 'Login'> & PropsFromRedux;

type State = { dirty: boolean; email: string; password: string; passwordVisible: boolean };

class LoginScreen extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { dirty: false, email: '', password: '', passwordVisible: false };
    }

    componentDidMount = () => this.props.actions.setLoginUserError('');

    onCreateAccount = () => this.props.navigation.replace('CreateAccount');

    onSave = async () => {
        const { email, password } = this.state;
        this.props.actions.login(email, password);
        this.setState({ dirty: false });
    };

    onForgotPassword = () => this.props.navigation.replace('ForgotPassword');

    render() {
        const { dirty, email, password, passwordVisible } = this.state;

        return (
            <ModalView>
                <KeyboardAwareScrollView
                    contentContainerStyle={[Styles.formContainer]}
                    keyboardShouldPersistTaps={'handled'}
                >
                    <View style={Styles.lightBackground}>
                        <Text
                            h4
                            style={[Styles.centerText, Styles.title, styles.welcome]}
                        >{`Welcome back!`}</Text>
                        <Input
                            autoCapitalize="none"
                            autoCompleteType="email"
                            key={`email_login`}
                            keyboardType="email-address"
                            label={`Email`}
                            onChangeText={(value) =>
                                this.setState({
                                    dirty: true,
                                    email: value.toLocaleLowerCase().trim(),
                                })
                            }
                            placeholder={`Email`}
                            textContentType="emailAddress"
                            value={email}
                        />
                        <Input
                            key={`password_login`}
                            label={`Password`}
                            onChangeText={(value) =>
                                this.setState({ dirty: true, password: value })
                            }
                            placeholder={`Password`}
                            rightIcon={
                                <Icon
                                    color={Colors.secondary}
                                    name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                                    onPress={() =>
                                        this.setState((prev) => ({
                                            passwordVisible: !prev.passwordVisible,
                                        }))
                                    }
                                    size={16}
                                    style={styles.icon}
                                    type="ionicon"
                                />
                            }
                            secureTextEntry={!passwordVisible}
                            textContentType="password"
                            value={password}
                        />

                        {this.props.error?.length && !dirty ? (
                            <MessageBox error text={this.props.error} />
                        ) : null}

                        <ClearButton
                            onPress={this.onForgotPassword}
                            title="Forgot Password?"
                            titleStyle={styles.textLink}
                        />
                    </View>

                    <PrimaryButton onPress={this.onSave} title="Log in" />
                    <Text style={[Styles.centerText, styles.text]}>{`Don't have an account?`}</Text>
                    <ClearButton
                        onPress={this.onCreateAccount}
                        title="Create your account here"
                        titleStyle={[Styles.centerText, styles.text, styles.createAccountLink]}
                    />
                    <VersionInfo center />
                </KeyboardAwareScrollView>
            </ModalView>
        );
    }
}

const styles = StyleSheet.create({
    icon: { height: 16 },
    text: { paddingTop: 5 },
    textLink: {
        color: Colors.secondary,
        fontSize: 14,
    },
    createAccountLink: { color: Colors.secondary, fontSize: 18, fontWeight: '700' },
    welcome: { paddingBottom: 20 },
});

const mapStateToProps = ({ user }: AppState) => ({ error: user.loginUserError, user: user.user });

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
    actions: bindActionCreators({ login, setLoginUserError }, dispatch),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(memo(LoginScreen));
