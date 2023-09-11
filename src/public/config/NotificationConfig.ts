import {Platform} from 'react-native';
import firebase from '@react-native-firebase/app';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import notifee from '@notifee/react-native';

export const firebaseNotificationListener = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  } else {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);
};

async function onMessageReceived(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  await notifee.displayNotification({
    title: message.notification?.title,
    body: message.notification?.body,
    data: message.data,
    id: message.messageId,
    android: {
      channelId: 'afterwords',
      smallIcon: 'ic_launcher',
      color: '#ffffff',
    },
    ios: {},
  });
}
