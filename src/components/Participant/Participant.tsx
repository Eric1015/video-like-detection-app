import React, { useEffect, useState } from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import firebase from '../../firebase';
import { useAppState } from '../../state';
import SurpriseFace from '../../components/SurpriseFace/SurpriseFace';
import JoyFace from '../../components/JoyFace/JoyFace';
import AngryFace from '../../components/AngryFace/AngryFace';
import { reactions } from '../../constants';
import UpIcon from '../UpIcon/UpIcon';

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
  const [showJoy, setShowJoy] = useState(false);
  const [showAngry, setShowAngry] = useState(false);
  const [showUp, setShowUp] = useState(false);

  useEffect(() => {
    const db = firebase.firestore();
    db.collection('users')
      .where('roomName', '==', currentRoomName)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(function(change) {
          if (change.type === 'modified') {
            if (change.doc.data().name === participant.identity) {
              switch (change.doc.data().reaction) {
                case reactions.SURPRISE:
                  setShowSurprise(true);
                  setTimeout(() => setShowSurprise(false), 2000);
                  break;
                case reactions.JOY:
                  setShowJoy(true);
                  setTimeout(() => setShowJoy(false), 2000);
                  break;
                case reactions.ANGRY:
                  setShowAngry(true);
                  setTimeout(() => setShowAngry(false), 2000);
                  break;
                case reactions.UP:
                  setShowUp(true);
                  setTimeout(() => setShowUp(false), 2000);
                  break;
              }
            }
          }
        });
      });
  });

  return (
    <ParticipantInfo participant={participant} onClick={onClick} isSelected={isSelected}>
      <ParticipantTracks participant={participant} disableAudio={disableAudio} enableScreenShare={enableScreenShare} />
      {showSurprise ? <SurpriseFace /> : <div></div>}
      {showJoy ? <JoyFace /> : <div></div>}
      {showAngry ? <AngryFace /> : <div></div>}
      {showUp ? <UpIcon /> : <div></div>}
    </ParticipantInfo>
  );
}
