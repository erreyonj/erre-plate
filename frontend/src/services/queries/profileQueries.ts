import { api } from '../api';
import type {
  UpdateProfilePayload,
  UpdateProfileResponse,
  UpdateChefProfilePayload,
  UpdateChefProfileResponse,
  PublicChefProfile,
  ChefProfile
} from '../../types/profile';
import type { User } from '../../types/user';
import type { FetchChefsParams } from '../../types/queryParams';

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

export async function uploadProfilePhoto(file: File) {
  const formData = new FormData()
  formData.append('photo', file)

  const { data } = await api.post('/profile/photo', formData)
  return data
}

/** Get own chef extension profile */
export const fetchChefProfile = async (): Promise<ChefProfile> => {
  const { data } = await api.get<ChefProfile>('/profile/chef/me');
  return data;
};


/** Get Chef's PUBLIC profile */
export const fetchPublicChefProfile = async (slug: string): Promise<PublicChefProfile> => {
  const { data } = await api.get<PublicChefProfile>(`/chef/${slug}`);
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


// * PUBLIC CHEF PROFILE SEARCH QUERIES

export const fetchChefs = async (params: FetchChefsParams): Promise<PublicChefProfile[]> => {
  const { data } = await api.get<PublicChefProfile[]>('/chefs', {params: {
    neighborhood: params.neighborhood ?? undefined
  }});
  return data
}