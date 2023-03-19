import axios from 'axios';
import { BASE_URL } from '../constants';
import { IRegister } from '../types';

const usersApi = axios.create({
  baseURL: BASE_URL + '/users',
  headers: {
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
  },
});

export const findAllUsers = async () => {
  return await usersApi.get('/all');
};

export const createUser = async (data: IRegister) => {
  return await usersApi.post('/create', data);
};
