import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { twMerge } from 'tailwind-merge';
import { createUser, findAllUsers } from '../../../api/users';
import Logo from '../../elements/Logo';
import RegisterForm from './layout/RegisterForm';
import { IRegister } from '../../../types';

const Register = () => {
  return (
    <div className='w-full h-full flex flex-col md:flex-row'>
      <div
        className={twMerge([
          'flex w-full pt-16 items-center justify-center',
          'md:w-1/2 md:h-full md:bg-blue-600',
        ])}
      >
        <Logo
          lg
          className={twMerge(['text-blue-600', 'md:mb-16 md:text-white'])}
        />
      </div>

      <div
        className={twMerge([
          'w-full h-full flex items-center justify-center',
          'md:w-1/2',
        ])}
      >
        <RegisterForm className='max-w-6xl w-[90%] md:w-[80%] xl:w-[70%]' />
      </div>
    </div>
  );
};

export default Register;
