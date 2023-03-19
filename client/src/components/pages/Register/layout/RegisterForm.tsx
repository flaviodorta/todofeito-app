import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { twMerge } from 'tailwind-merge';
import { createUser } from '../../../../api/users';
import { IRegister } from '../../../../types';
import Button from '../../../elements/Button';
import Form from '../../../elements/Form';
import Input from '../../../elements/Input';
import Label from '../../../elements/Label';

interface Props extends React.ComponentPropsWithoutRef<'form'> {}

const RegisterForm = ({ className, ...props }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegister>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const mutation = useMutation(createUser, {
    onSuccess: () => console.log('User created'),
  });

  return (
    <Form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className={className}
      {...props}
    >
      <div className='flex flex-col gap-2'>
        <Label htmlFor='name'>Name</Label>
        <Input id='name' type='text' {...register('name')} />
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' type='email' {...register('email')} />
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='password'>Password</Label>
        <Input id='password' type='password' {...register('password')} />
      </div>

      <Button type='submit'>Register</Button>
    </Form>
  );
};

RegisterForm.defaultProps = {};

export default RegisterForm;
