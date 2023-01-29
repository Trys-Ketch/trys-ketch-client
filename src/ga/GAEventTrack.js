import ReactGA from 'react-ga4';

const GAEventTrack = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

export default GAEventTrack;
