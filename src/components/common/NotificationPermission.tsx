



import React from 'react';
import { messaging, getToken, onMessage } from '../../../src/farebase';

const NotificationPermission: React.FC = () => {
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: 'BE3uTUpKXBIXb-ehR8gJhHl7Msd4tKMz_hBdbN-4GQNYvLU2KGgAch39XWUnQqSmohKeYNYv_KflCWHVeqYMd1I'
        });
        console.log('FCM Token:', token);
        // send token to backend
      } else {
        console.log('Permission not granted');
      }
    } catch (err) {
      console.error('Error getting notification permission or token:', err);
    }
  };

  // Foreground message listener
  React.useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      if (Notification.permission === 'granted') {
        const { title, body } = payload.notification || {};
        new Notification(title || 'New Message', {
          body: body || 'You have a new notification',
          icon: '/logo192.png',
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <button onClick={requestPermission}>
      Enable Notifications
    </button>
  );
};

export default NotificationPermission;
