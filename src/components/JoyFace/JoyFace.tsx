import React from 'react';
import styled, { keyframes } from 'styled-components';
import UIfx from 'uifx';

import joyImage from '../../images/joy.jpg';
const sound = require('../../sound/shortCircuit.mp3');

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

export default function SurpriseFace() {
  return (
    <FadeInUpDiv>
      <img src={joyImage} onLoad={() => zz.play()} alt="" width="100px" height="100px" />
    </FadeInUpDiv>
  );
}
