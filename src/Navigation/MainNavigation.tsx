import React from 'react';
import {ActivityIndicator, Linking, StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  CommonActions,
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import * as Screens from '../screens';
import {showToastMessage} from '../common/Globals';
import {color} from '../assets/Common/GlobalConstant';

const Stack = createNativeStackNavigator();
const ModalStack = createNativeStackNavigator();

type RootStackParamList = {
  LandingScreen: undefined;
  SignInScreen: undefined;
  SignUpScreen: undefined;
  StepZero: undefined;
  StepOne: undefined;
  StepTwo: undefined;
  StepThree: undefined;
  StepFour: undefined;
  StepFive: undefined;
  StepSix: undefined;
  StepSeven: undefined;
  StepEight: undefined;
  StepNine: undefined;
  StepTen: undefined;

  ReferralsScreen: undefined;
  AccountsScreen: undefined;
  EarningScreen: undefined;
  ContactUsScreen: undefined;

  TabNavigation: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigate = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

interface Route {
  name: string;
}

export const navigateAndReset = (
  routes: Route[] = [],
  statusCode?: number,
): void => {
  if (statusCode === 401) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes,
        }),
      );
      showToastMessage('Session expired, Please login again', 'danger');
    }
  }
};

export const navigateAndSimpleReset = (name, index = 0) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes: [{name}],
      }),
    );
  }
};

export const navigateAndGoBack = () => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.goBack({}));
  }
};

export default class MainNavigation extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    const MainStackScreen = () => {
      return (
        <Stack.Navigator initialRouteName={this?.props?.initialStack}>
          <Stack.Screen
            name="LandingScreen"
            component={Screens.LandingScreen}
            options={{
              headerShown: false,
              title: '',
              headerBackVisible: false,
              headerShadowVisible: false,
              headerTitleAlign: 'center',
            }}
          />
         
          
        </Stack.Navigator>
      );
    };

    const linking = {
      prefixes: ['Your deeplink Url'],
      config: {
        screens: {
          ResetPassSecond: 'reset/',
        },
      },
      async getInitialURL() {
        return Linking.getInitialURL();
      },
    };

    return (
      <View style={{flex: 1}}>
        <NavigationContainer
          fallback={
            <ActivityIndicator
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
              color={color.tabPink}
              size={'large'}
            />
          }
          linking={linking}
          ref={navigationRef}>
          <ModalStack.Navigator
            screenOptions={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
            }}>
            <ModalStack.Screen
              name="MainStackScreen"
              component={MainStackScreen}
              options={{
                headerShown: false,
              }}
            />
          </ModalStack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}
const style = StyleSheet.create({});
