import React from 'react';
import Button from '../components/common/Button';

export default {
  title: 'Button',
  componenet: Button,
};

function Template(args) {
  return <Button {...args} />;
}

export const Red = Template.bind({});
Red.args = {
  backgroundColor: 'red',
  label: 'Press Me',
  size: 'md',
};

export function Blue() {
  return <Button label="Press me" backgroundColor="blue" />;
}
