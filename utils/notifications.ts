import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Client, SubscriptionDuration } from '@/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    console.log('Notifications are not supported on web');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get notification permissions');
    return false;
  }

  return true;
};

const calculateExpiryDate = (startDate: number, duration: SubscriptionDuration): number => {
  const start = new Date(startDate);
  
  switch (duration) {
    case 'ONE_WEEK':
      return new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000).getTime();
    case 'ONE_MONTH':
      const oneMonthLater = new Date(start);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      return oneMonthLater.getTime();
    case 'ONE_YEAR':
      const oneYearLater = new Date(start);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      return oneYearLater.getTime();
    default:
      return start.getTime();
  }
};

export const scheduleNotification = async (client: Client): Promise<string | null> => {
  if (Platform.OS === 'web') {
    console.log('Notifications not supported on web');
    return null;
  }

  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    const expiryDate = calculateExpiryDate(client.subscriptionStartDate, client.subscriptionDuration);
    const now = Date.now();

    if (expiryDate <= now) {
      console.log('Expiry date is in the past, not scheduling notification');
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Subscription Renewal Due',
        body: `${client.name}'s subscription is expiring soon!`,
        data: { clientId: client.id },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: expiryDate,
      },
    });

    console.log('Notification scheduled:', notificationId, 'for', new Date(expiryDate));
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Notification cancelled:', notificationId);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
};

export const getExpiryDate = (startDate: number, duration: SubscriptionDuration): Date => {
  return new Date(calculateExpiryDate(startDate, duration));
};

export const getDaysUntilExpiry = (startDate: number, duration: SubscriptionDuration): number => {
  const expiryDate = calculateExpiryDate(startDate, duration);
  const now = Date.now();
  const diffMs = expiryDate - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isExpired = (startDate: number, duration: SubscriptionDuration): boolean => {
  const expiryDate = calculateExpiryDate(startDate, duration);
  return Date.now() > expiryDate;
};
