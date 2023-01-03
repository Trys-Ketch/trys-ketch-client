import React from 'react';
import Button from '../components/common/Button';

export default {
  title: 'Button',
  componenet: Button,
  argTypes: {
    backgroundColor: {
      control: { type: 'color' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    handleClick: { action: 'handleClick' },
  },
};

function Template(args) {
  return <Button {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  color: 'white',
  backgroundColor: 'red',
  label: 'Press Me',
  size: 'md',
};

export const Blue = Template.bind({});
Blue.args = {
  color: 'white',
  backgroundColor: 'blue',
  label: 'Press Me',
  size: 'md',
};

export const Small = Template.bind({});
Small.args = {
  color: 'white',
  backgroundColor: 'red',
  label: 'Press Me',
  size: 'sm',
};

export const Large = Template.bind({});
Large.args = {
  color: 'white',
  backgroundColor: 'red',
  label: 'Press Me',
  size: 'lg',
};

export const LongLabel = Template.bind({});
LongLabel.args = {
  color: 'white',
  backgroundColor: 'red',
  label: 'Press Me asdfasdfasdfasdf asdf asdfasdf',
  size: 'md',
};
