import React from 'react';
import Example from '../components/common/Example';

export default {
  title: 'Test',
  component: Example,
};

export function Default(args) {
  return <Example {...args} />;
}

export function Blue() {
  return <Example color="blue" />;
}
