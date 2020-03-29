import { useEffect, useState } from 'react';
import { RemoteParticipant } from 'twilio-video';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useVideoContext from '../useVideoContext/useVideoContext';
import firebase from 'firebase/app';
import 'firebase/database';

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

export default function useParticipants() {
  const { room } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const [participants, setParticipants] = useState(Array.from(room.participants.values()));

  const createUser = (sid: string) => {
    firebase
      .database()
      .ref('users/' + sid)
      .set({
        reaction: reactions.IDLE,
      });
  };

  // When the dominant speaker changes, they are moved to the front of the participants array.
  // This means that the most recent dominant speakers will always be near the top of the
  // ParticipantStrip component.
  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
  }, []);

  useEffect(() => {
    if (dominantSpeaker) {
      setParticipants(prevParticipants => [
        dominantSpeaker,
        ...prevParticipants.filter(participant => participant !== dominantSpeaker),
      ]);
    }
  }, [dominantSpeaker]);

  useEffect(() => {
    const participantConnected = (participant: RemoteParticipant) => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
      createUser(participant.sid);
    };
    const participantDisconnected = (participant: RemoteParticipant) =>
      setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    return () => {
      room.off('participantConnected', participantConnected);
      room.off('participantDisconnected', participantDisconnected);
    };
  }, [room]);

  return participants;
}
