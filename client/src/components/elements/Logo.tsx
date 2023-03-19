import React from 'react';
import { twMerge } from 'tailwind-merge';
import { BiTask } from 'react-icons/bi';

interface Props extends React.ComponentPropsWithoutRef<'h1'> {
  md?: boolean;
  lg?: boolean;
  xl?: boolean;
}

const Logo = ({ md, lg, xl, className, ...props }: Props) => {
  return (
    <h1
      className={twMerge([
        'px-4 py-6 flex items-center gap-2 font-black uppercase text-blue-600',
        'text-[8vw] sm:text-[5vw] md:text-[3vw] lg:text-[1vw]',
        md && 'text-[9vw] sm:text-[6vw] md:text-[4vw] lg:text-[2vw]',
        lg && 'text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[3vw]',
        className,
      ])}
      {...props}
    >
      <BiTask
        className={twMerge([
          'text-[calc(8vw+8vw/3)] sm:text-[calc(5vw+5vw/3)] md:text-[calc(3vw+3vw/3)] ld:text-[calc(1vw+1vw/3)]',
          md &&
            'text-[calc(9vw+9vw/3)] sm:text-[calc(6vw+6vw/3)] md:text-[calc(3vw+3vw/3)] ld:text-[calc(2vw+2vw/3)]',
          lg &&
            'text-[calc(10vw+10vw/3)] sm:text-[calc(7vw+7vw/3)] md:text-[calc(5vw+5vw/3)] ld:text-[calc(3vw+3vw/3)]',
        ])}
      />
      Todofeito
    </h1>
  );
};

Logo.defaultProps = {
  md: false,
  lg: false,
  xl: false,
};

export default Logo;
