import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = React.ComponentPropsWithoutRef<'input'>;

const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <input
      ref={ref}
      className={twMerge([
        'p-1 text-md w-full rounded-sm',
        'border-[1px] border-gray-300 focus:border-gray-400 outline-none',
        'transition-all duration-300 ease-in-out',
        props.className,
      ])}
      {...props}
    />
  );
});

export default Input;
