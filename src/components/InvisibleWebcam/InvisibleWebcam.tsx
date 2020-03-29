import React, { useState } from 'react';
import Webcam from 'react-webcam';
// import vision from 'react-cloud-vision-api';
import useInterval from 'use-interval';
import SurpriseFace from '../SurpriseFace/SurpriseFace';
import JoyFace from '../JoyFace/JoyFace';
import AngryFace from '../AngryFace/AngryFace';

import './InvisibleWebcam.css';
import { isSurpriseFace, isJoyFace, isAngryFace } from '../../helpers/faceDetectionHelper';
import { getVisionAPIResult, getThumbsupResult } from '../../helpers/requestsHelper';
import { isIterable } from '../../helpers/general';
import firebase from '../../firebase';
import { useAppState } from '../../state';
import { reactions } from '../../constants';
import UpIcon from '../UpIcon/UpIcon';

function InvisibleWebcam() {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
  };

  const webcamRef: any = React.useRef(null);

  const { userDocId } = useAppState();

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const visionResult = await getVisionAPIResult(imageSrc);
    const thumbsupResult = await getThumbsupResult(imageSrc);

    if (!thumbsupResult.hasOwnProperty('error') && isIterable(thumbsupResult.payload)) {
      for (let result of thumbsupResult.payload) {
        if (
          (result.displayName === 'up' ||
            result.displayName === 'ok' ||
            result.displayName === 'two' ||
            result.displayName === 'raise') &&
          result.classification.score > 0.9
        ) {
          setShowUp(true);
          setTimeout(() => setShowUp(false), 2000);
          const db = firebase.firestore();
          db.collection('users')
            .doc(userDocId)
            .update({
              reaction: reactions.UP,
            });
          db.collection('users')
            .doc(userDocId)
            .update({
              reaction: reactions.IDLE,
            });
          break;
        }
      }
    }

    if (!visionResult.hasOwnProperty('error') && isIterable(visionResult.responses)) {
      for (let result of visionResult.responses) {
        if (isIterable(result.faceAnnotations)) {
          for (let faceAnnotation of result.faceAnnotations) {
            if (isSurpriseFace(faceAnnotation)) {
              setShowSurprise(true);
              setTimeout(() => setShowSurprise(false), 2000);
              const db = firebase.firestore();
              db.collection('users')
                .doc(userDocId)
                .update({
                  reaction: reactions.SURPRISE,
                });
              db.collection('users')
                .doc(userDocId)
                .update({
                  reaction: reactions.IDLE,
                });
              break;
            }

            if (isJoyFace(faceAnnotation)) {
              setShowJoy(true);
              setTimeout(() => setShowJoy(false), 2000);
              const db = firebase.firestore();
              db.collection('users')
                .doc(userDocId)
                .update({
                  reaction: reactions.JOY,
                });
              db.collection('users')
                .doc(userDocId)
                .update({
                  reaction: reactions.IDLE,
                });
              break;
            }

            if (isAngryFace(faceAnnotation)) {
              setShowAngry(true);
              setTimeout(() => setShowAngry(false), 2000);
              const db = firebase.firestore();
              db.collection('users')
                .doc(userDocId)
                .update({
                  reaction: reactions.ANGRY,
                });
              db.collection('users')
                .doc(userDocId)
                .update({
                  reaction: reactions.IDLE,
                });
              break;
            }
          }
        }
      }
    }

    // vision.init({ auth: process.env.REACT_APP_VISION_API_KEY });
    // const req = new vision.Request({
    //   image: new vision.Image({
    //     base64: imageSrc
    //   }),
    //   features: [
    //     new vision.Feature('FACE_DETECTION', 5),
    //   ]
    // })
    // vision.annotate(req).then((res: any) => {
    //   // handling response
    //   for (let result of res.responses) {
    //     for (let faceAnnotation of result.faceAnnotations) {
    //       if (isSurpriseFace(faceAnnotation)) {
    //         setShowSurprise(true);
    //         setTimeout(() => setShowSurprise(false), 2000);
    //         break;
    //       }
    //     }
    //   }

    // }, (e) => {
    //   console.log('Error: ', e)
    // })
  };

  const [showSurprise, setShowSurprise] = useState(false);

  const [showJoy, setShowJoy] = useState(false);

  const [showAngry, setShowAngry] = useState(false);

  const [showUp, setShowUp] = useState(false);

  useInterval(capture, 1000);

  return (
    <div className="App">
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
        className="webcamera"
      />
      {showSurprise ? <SurpriseFace /> : <div></div>}
      {showJoy ? <JoyFace /> : <div></div>}
      {showAngry ? <AngryFace /> : <div></div>}
      {showUp ? <UpIcon /> : <div></div>}
    </div>
  );
}

export default InvisibleWebcam;
