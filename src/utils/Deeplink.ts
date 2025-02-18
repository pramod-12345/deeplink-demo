import AsyncStorage from '@react-native-async-storage/async-storage';
import {storageKeys} from '../common/storage';
import {storage} from '../common/storage';
import {navigationRef} from '../navigators/MainNavigation';
import { extractCampaignParams, toggleLoader } from '../common/Globals';



export const handleDeepLink = async ({url}  : {url: string}) => {
  await waitForNavigationReady();
  if (url && navigationRef.isReady()) {

    performDeepLink({url: url});
    // await AsyncStorage.removeItem('pendingDeepLink');
    storage.delete('pendingDeepLink');
  }
};


const navigateToScreen = (
  screen: string,
  params?: object,
  nestedScreen?: string,
) => {
  // @ts-ignore
  // navigationRef.navigate(screen, {
  //   screen: nestedScreen,
  //   params: params,
  // });
  navigationRef.navigate(screen, {...params});
};


const handleEditScreen = (url: string) => {
    const queryString = url.split('?')[1] || '';
    let tValue = null;

    const match = queryString.match(/(?:^|&)t=([^&]*)/);

    if (match) {
        tValue = decodeURIComponent(match[1]);
    }

    if (tValue === '2') {
        navigateToScreen(screens.EditScreen, { initialTab: 'Social Media' });
    } else if (tValue === '4') {
        navigateToScreen(screens.EditScreen, { initialTab: 'Packages' });
    } else {
        navigateToScreen(screens.EditScreen, { initialTab: 'Details' });
    }
}

const handleNextUrl = (url: string) => {
  const queryString = url.split('?')[1] || '';
  let nextValue = null;

  const match = queryString.match(/(?:^|&)next=([^&]*)/);

  if (match) {
      nextValue = decodeURIComponent(match[1]); 
  }

  if (nextValue) {
      const segments = nextValue.split('/').filter(Boolean); 
      if (segments.length === 1) {
          navigateToScreen(screens.ProfileScreen);
      } else if (segments.length >= 2) {
          console.log("Goes to Campaign");
          navigateToScreen(screens.CampaignDetailsScreen, {
            id: null,
            inviteId: null,
            url: segments[1],
            brand: segments[0],
            isFromPush: true
          });
      } else {
          console.log("Invalid 'next' parameter");
      }
  } else {
      console.log("Missing 'next' parameter");
  }
}

const performDeepLink = ({url}: {url: string}) => {
  const loginToken = storage.getString(storageKeys.loginToken);

  console.log('Received deep link:', url);


  if (loginToken) { 
    if (url && url.includes('reset')) {
      navigateToScreen(screens.ResetPassSecond, {url});
    } else if (url && url.includes('/insights')) {
      navigateToScreen(screens.Insights);
    } else if (url && url.includes('account?')) {
      navigateToScreen(screens.AccountsScreen);
    } else if (url && url.includes('referrals?')) {
      navigateToScreen(screens.ReferralsScreen);
    } else if (url && url.includes('orders')) {
      const orderId = url.split('o=')[1]?.split('&')[0];
        navigateToScreen(screens.OrderChatScreen, {
          roomId: orderId,
          isFromEmail: true,
        });
    } else if (url && url.includes('how-to-be-successful')) {
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'HTBScreen'}],
        });
    } else if (url && url.includes('edit-page')) {
        handleEditScreen(url);
    } else if (url && url === 'https://collabstr.com') {
        navigateToScreen(screens.ProfileScreen);
    } else if (url && url.includes('next=')) {
        handleNextUrl(url);
    } else {
      console.log(' ----Link does not match any screen--> ',url )
    }
  } else {
    if (url && url.includes('reset')) {
      navigateToScreen(screens.ResetPassSecond, {url});
    } else {
      navigateToScreen(screens.SignInScreen);
    }
  }
};


const screens = {
  ResetPassSecond: 'ResetPassSecond',
  ClaimUserScreen: 'ClaimUserScreen',
  Insights: 'Insights',
  AccountsScreen: 'AccountsScreen',
  ReferralsScreen: 'ReferralsScreen',
  OrderChatScreen: 'OrderChatScreen',
  EditScreen: 'EditScreen',
  HTBScreen: 'HTBScreen',
  SignInScreen: 'SignInScreen',
  ProfileScreen: 'Profile',
  CampaignDetailsScreen: 'CampaignDetailsScreen',
};


export const waitForNavigationReady = async () => {
  toggleLoader(true)
  while (!navigationRef.isReady()) {
    await new Promise(resolve => setTimeout(resolve, 100)).finally(()=>{
      toggleLoader(false)
    });
  }
  toggleLoader(false)
};