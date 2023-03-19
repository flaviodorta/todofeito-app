import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends React.ComponentPropsWithoutRef<'label'> {}

const Label = (props: Props) => {
  return (
    <label
      className={twMerge(['w-full flex text-lg', props.className])}
      {...props}
    >
      {props.children}
    </label>
  );
};

export default Label;
