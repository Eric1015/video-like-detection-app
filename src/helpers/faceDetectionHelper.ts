export const isJoyFace = (faceInfo: any) => {
  if (faceInfo.joyLikelihood === 'VERY_LIKELY') {
    return true;
  } else {
    return false;
  }
};

export const isSurpriseFace = (faceInfo: any) => {
  if (faceInfo.surpriseLikelihood === 'LIKELY' || faceInfo.surpriseLikelihood === 'VERY_LIKELY') {
    return true;
  } else {
    return false;
  }
};

export const isAngryFace = (faceInfo: any) => {
  if (faceInfo.angerLikelihood === 'LIKELY' || faceInfo.angerLikelihood === 'VERY_LIKELY') {
    return true;
  } else {
    return false;
  }
};
