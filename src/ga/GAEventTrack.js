import ReactGA from 'react-ga';

const GAEventTrack = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

export default GAEventTrack;
