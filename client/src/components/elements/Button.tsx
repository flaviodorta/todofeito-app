import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends React.ComponentPropsWithoutRef<'button'> {
  icon?: React.ReactNode;
  secondary?: boolean;
  disabled?: boolean;
}

const Button = (props: Props) => {
  return (
    <button
      className={twMerge(
        'px-4 py-3 w-fit flex gap-1 text-white font-bold uppercase tracking-wide rounded-lg cursor-pointer',
        'bg-blue-600 text-white hover:brightness-[.95] active:brightness-[.90]',
        props.secondary &&
          'bg-white text-blue-600 hover:brightness-[.95] active:brightness-[.90]',
        props.disabled &&
          'bg-gray-300 text-gray-600 cursor-not-allowed hover:brightness-[1] active:brightness-[1]',
        props.className
      )}
    >
      {props.icon}
      {props.children}
    </button>
  );
};

Button.defaultProps = {
  secondary: false,
  disabled: false,
  icon: null,
  label: '',
};

export default Button;
