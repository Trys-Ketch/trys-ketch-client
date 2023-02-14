export const appear = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
  },
};

export const scaleUp = {
  hidden: {
    opacity: 0,
    scale: 0.75,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: 'easeOut',
      duration: 0.15,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.75,
    transition: {
      ease: 'easeIn',
      duration: 0.15,
    },
  },
};

export const fadeInScale = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.3,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.2 },
  },
};
