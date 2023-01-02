import React from 'react';
import Example from '../components/common/Example';

export default {
  title: 'Components',
  componenet: Example,
};

export function Default() {
  return <Example />;
}

export function Blue() {
  return <Example color="blue" />;
}
