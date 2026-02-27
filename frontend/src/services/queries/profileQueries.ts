import { api } from '../api';
import type {
  UpdateProfilePayload,
  UpdateProfileResponse,
  UpdateChefProfilePayload,
  UpdateChefProfileResponse,
  ChefProfile
} from '../../types/profile';
import type { User } from '../../types/user';

/** Get base authenticated user */
export const fetchProfile = async (): Promise<User> => {
  const { data } = await api.get<User>('/profile');
  return data;
};

/** Update base profile */
export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<User> {
  const { data } = await api.put<UpdateProfileResponse>(
    '/profile',
    payload
  );

  return data.user;
}

/** Get chef extension profile */
export const fetchChefProfile = async (): Promise<ChefProfile> => {
  const { data } = await api.get<ChefProfile>('/profile/chef');
  return data;
};

/** Update chef extension profile */
export const updateChefProfile = async (
  payload: UpdateChefProfilePayload
): Promise<ChefProfile> => {
  const { data } = await api.put<UpdateChefProfileResponse>(
    '/profile/chef',
    payload
  );

  return data.chefProfile;
};