export const getThumbsupResult = async (imageSrc: string) => {
  let body = JSON.stringify({
    payload: {
      image: {
        imageBytes: imageSrc ? imageSrc.substring(imageSrc.indexOf(',') + 1) : imageSrc,
      },
    },
  });
  let response = await fetch(
    'https://automl.googleapis.com/v1beta1/projects/315605057818/locations/us-central1/models/ICN169619459793747968:predict',
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_GOOGLE_MODEL_TOKEN}`,
      },
      method: 'POST',
      body: body,
    }
  );
  let res = await response.json();
  return res;
};

export const getVisionAPIResult = async (imageSrc: string) => {
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
  return res;
};
