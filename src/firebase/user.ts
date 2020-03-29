import { useCallback, useEffect, useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
};

const reactions = {
  IDLE: 'IDLE',
  SURPRISE: 'SURPRISE',
};

export default function useFirebaseUser() {
  const createUser = useCallback((sid: string) => {
    firebase
      .database()
      .ref('users/' + sid)
      .set({
        reaction: reactions.IDLE,
      });
  }, []);

  const updateReaction = useCallback((sid: string, reaction: string) => {
    let updates: any = {};
    updates['users/' + sid] = { sid, reaction };
    firebase
      .database()
      .ref()
      .update(updates);
  }, []);

  const listenOnReaction = useCallback((sid: string, callback: (input: any) => void) => {
    firebase
      .database()
      .ref('users/' + sid)
      .on('value', snapshot => {
        callback(snapshot.val());
      });
  }, []);

  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
  }, []);

  return [createUser, updateReaction, listenOnReaction];
}
