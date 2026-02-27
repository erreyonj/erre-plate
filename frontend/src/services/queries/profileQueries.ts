import { api } from '../api';

export const fetchProfile = async () => {
  const { data } = await api.get('/profile');
  return data;
};

export const updateProfile = async (payload: any) => {
  const { data } = await api.put('/profile', payload);
  return data;
};

export const fetchChefProfile = async () => {
  const { data } = await api.get('/profile/chef');
  return data;
};

export const updateChefProfile = async (payload: any) => {
  const { data } = await api.put('/profile/chef', payload);
  return data;
};