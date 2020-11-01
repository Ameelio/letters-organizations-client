declare const window: any;

export const track = (event: string, properties?: Object) => {
  window.analytics.track(event, properties);
};

export const loadSegment = () => {
  if (process.env.NODE_ENV === 'production') {
    window.analytics.load(process.env.REACT_APP_SEGMENT_KEY_PROD);
  } else {
    window.analytics.load(process.env.REACT_APP_SEGMENT_KEY_STAGING);
  }
};

export const identify = (email: string, properties?: Object) => {
  window.analytics.identify(email, properties);
};
