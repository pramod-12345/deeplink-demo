if (__DEV__) {
  require('./ReactotronConfig');
}

import React, {useCallback, useEffect, useState} from 'react';
import MainNavigation, {navigationRef} from './src/navigators/MainNavigation';
import Loader from './src/common/Loader';
import {getAsyncData, setLoaderRef, toastConfig} from './src/common/Globals';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider as StoreProvider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import SplashScreen from './src/screens/SplashScreen';
import {Linking, LogBox, StatusBar, View} from 'react-native';
import {
  StripeProvider,
  initStripe,
  useStripe,
} from '@stripe/stripe-react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import FlashMessage from 'react-native-flash-message';
import PushNotification from './src/utils/PushNotificaiton';
import {storage, storageKeys} from './src/common/storage';
import {appConstant} from './src/common/Constants';
import Toast from 'react-native-toast-message';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import { handleDeepLink } from './src/utils/Deeplink';

// TODO: Remove when fixed
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Warning: componentWillReceiveProps has been renamed, and is not recommended',
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
  'Warning: componentWillMount has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.',
  'Non-serializable values were found in the navigation state.',
  'new NativeEventEmitter',
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.',
]);

const App = () => {
  const [initialStack, setInitialStack] = useState('LandingScreen');
  const [isLoading, setIsLoading] = useState(true);
  const [initialUrl, setInitialUrl] = useState(null);


  useEffect(() => {
    const getInitialURL = async () => {
      const url = await Linking.getInitialURL();
      console.log(' ---url 333---> ', url);
      if (url) {
        handleDeepLink({url: url});
        setInitialUrl(url);
      }
    };

    getInitialURL();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const loginToken = storage.getString(storageKeys.loginToken);
      const onboarding_completed = storage.getBoolean(
        storageKeys.onboardingCompleted,
      );
      const stepName = storage.getString(storageKeys.onboardingStep);

      if (initialUrl && initialUrl?.includes('reset')) {
        setInitialStack('ResetPassSecond');
      } else if (loginToken && onboarding_completed) {
        setInitialStack('TabNavigation');
      } else if (loginToken && !onboarding_completed) {
        setInitialStack(`${stepName}`);
      } else {
        setInitialStack('LandingScreen');
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, [initialUrl]);

  React.useEffect(() => {
    Linking.addEventListener('url', handleDeepLink);
    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);


  return (
    <>
      <StoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PushNotification />
          {isLoading ? (
            <SafeAreaProvider style={{flex: 1, backgroundColor: 'white'}}>
              <SplashScreen />
            </SafeAreaProvider>
          ) : (
            <View style={{flex: 1, backgroundColor: 'white'}}>
              <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
              
            </View>
          )}
        </PersistGate>
      </StoreProvider>
      <Loader ref={ref => setLoaderRef(ref)} />
    </>
  );
};

// export default App;
export default Sentry.wrap(App);
