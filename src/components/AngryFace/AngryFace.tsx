import React from 'react';
import styled, { keyframes } from 'styled-components';
import UIfx from 'uifx';

import angryImage from '../../images/angry.png';
const sound = require('../../sound/backgroundSound.wav');

const fadeInUpAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }`;

const zz = new UIfx(sound, {
  volume: 0.9, // number between 0.0 ~ 1.0
  throttleMs: 100,
});

const FadeInUpDiv = styled.div`
  animation: ${fadeInUpAnimation} 1s ease-out 1;
  position: absolute;
  right: 10%;
  bottom: 10%;
`;

export default function AngryFace() {
  return (
    <FadeInUpDiv>
      <img src={angryImage} onLoad={() => zz.play()} alt="" width="100px" height="100px" />
    </FadeInUpDiv>
  );
}
