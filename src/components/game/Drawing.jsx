import React from 'react';
import Paint from '../painting/Paint';

function Drawing({ submitImg }) {
  return <Paint submitImg={submitImg} />;
}

export default Drawing;
