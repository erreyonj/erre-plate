import { api } from '../api';
import type {
  UpdateProfilePayload,
  UpdateProfileResponse,
  UpdateChefProfilePayload,
  UpdateChefProfileResponse,
  ChefProfile,
  PublicChefPageResponse,
  PaginatedResponse,
  PublicChefProfile,
} from '../../types/profile';
import type { User } from '../../types/user';
import type { ChefQueryFilters } from '../../types/queryParams';

export const fetchProfile = async (): Promise<User> => {
  const { data } = await api.get<User>('/profile');
  return data;
};

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<User> {
  const { data } = await api.put<UpdateProfileResponse>(
    '/profile',
    payload
  );
  return data.user;
}

export async function uploadProfilePhoto(uri: string) {
  const formData = new FormData();
  const filename = uri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';
  formData.append('photo', { uri, name: filename, type } as any);
  const { data } = await api.post('/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export const fetchChefProfile = async (): Promise<ChefProfile> => {
  const { data } = await api.get<ChefProfile>('/profile/chef/me');
  return data;
};

export async function fetchPublicChefProfile(slug: string) {
  const { data } = await api.get<PublicChefPageResponse>(`/chefs/${slug}`)
  return data
}

export const updateChefProfile = async (
  payload: UpdateChefProfilePayload
): Promise<ChefProfile> => {
  const { data } = await api.put<UpdateChefProfileResponse>(
    '/profile/chef',
    payload
  );
  return data.chefProfile;
};

export const fetchChefs = async (
  filters: ChefQueryFilters
): Promise<PublicChefProfile[]> => {
  const params: Record<string, any> = {}

  if (filters.neighborhood !== undefined) {
    params.neighborhood =
      filters.neighborhood === null ? 'all' : filters.neighborhood
  }

  if (filters.cuisine) {
    params.cuisine = filters.cuisine
  }

  if (filters.rating) {
    params.rating = filters.rating
  }

  if (filters.search) {
    params.search = filters.search
  }

  const { data } = await api.get<PaginatedResponse<PublicChefProfile[]>>(
    '/chefs',
    { params }
  )

  return data.data
}
