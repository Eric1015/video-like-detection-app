import React, { useState } from 'react';
import Webcam from 'react-webcam';
// import vision from 'react-cloud-vision-api';
import useInterval from 'use-interval';
import SurpriseFace from '../SurpriseFace/SurpriseFace';
import JoyFace from '../JoyFace/JoyFace';
import AngryFace from '../AngryFace/AngryFace';

import './InvisibleWebcam.css';
import { isSurpriseFace, isJoyFace, isAngryFace } from '../../helpers/faceDetectionHelper';
import { isIterable } from '../../helpers/general';

function InvisibleWebcam() {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
  };

  const webcamRef: any = React.useRef(null);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    let body = JSON.stringify({
      requests: [
        {
          features: [
            // { type: "LABEL_DETECTION", maxResults: 10 },
            // { type: "LANDMARK_DETECTION", maxResults: 5 },
            { type: 'FACE_DETECTION', maxResults: 5 },
            // { type: "LOGO_DETECTION", maxResults: 5 },
            // { type: "TEXT_DETECTION", maxResults: 5 },
            // { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
            // { type: "SAFE_SEARCH_DETECTION", maxResults: 5 },
            // { type: "IMAGE_PROPERTIES", maxResults: 5 },
            // { type: "CROP_HINTS", maxResults: 5 },
            // { type: "WEB_DETECTION", maxResults: 5 }
          ],
          image: {
            content: imageSrc ? imageSrc.substring(imageSrc.indexOf(',') + 1) : imageSrc,
          },
        },
      ],
    });
    let response = await fetch(
      'https://vision.googleapis.com/v1/images:annotate?key=' + process.env.REACT_APP_VISION_API_KEY,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: body,
      }
    );
    let res = await response.json();
    if (!res.hasOwnProperty('error') && isIterable(res.responses)) {
      for (let result of res.responses) {
        if (isIterable(result.faceAnnotations)) {
          for (let faceAnnotation of result.faceAnnotations) {
            if (isSurpriseFace(faceAnnotation)) {
              setShowSurprise(true);
              setTimeout(() => setShowSurprise(false), 2000);

              break;
            }

            if (isJoyFace(faceAnnotation)) {
              setShowJoy(true);
              setTimeout(() => setShowJoy(false), 2000);

              break;
            }

            if (isAngryFace(faceAnnotation)) {
              setShowAngry(true);
              setTimeout(() => setShowAngry(false), 2000);

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
    </div>
  );
}

export default InvisibleWebcam;
