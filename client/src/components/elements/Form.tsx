import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface Props extends React.ComponentPropsWithoutRef<'form'> {}

const Form = ({ className, ...props }: Props) => {
  return (
    <form {...props} className={twMerge(['flex flex-col gap-4', className])}>
      {props.children}
    </form>
  );
};

Form.defaultProps = {};

export default Form;
