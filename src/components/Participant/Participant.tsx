import React, { useEffect, useState } from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import firebase from '../../firebase';
import { useAppState } from '../../state';
import SurpriseFace from '../../components/SurpriseFace/SurpriseFace';

interface ParticipantProps {
  participant: LocalParticipant | RemoteParticipant;
  disableAudio?: boolean;
  enableScreenShare?: boolean;
  onClick: () => void;
  isSelected: boolean;
}

export default function Participant({
  participant,
  disableAudio,
  enableScreenShare,
  onClick,
  isSelected,
}: ParticipantProps) {
  const { currentRoomName } = useAppState();
  const [showSurprise, setShowSurprise] = useState(false);

  useEffect(() => {
    const db = firebase.firestore();
    db.collection('users')
      .where('roomName', '==', currentRoomName)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(function(change) {
          if (change.type === 'modified') {
            if (change.doc.data().name === participant.identity) {
              setShowSurprise(true);
              setTimeout(() => setShowSurprise(false), 2000);
            }
          }
        });
      });
  });

  return (
    <ParticipantInfo participant={participant} onClick={onClick} isSelected={isSelected}>
      <ParticipantTracks participant={participant} disableAudio={disableAudio} enableScreenShare={enableScreenShare} />
      {showSurprise ? <SurpriseFace /> : <div></div>}
    </ParticipantInfo>
  );
}
