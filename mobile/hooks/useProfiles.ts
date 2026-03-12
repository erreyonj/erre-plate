import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchChefProfile, updateChefProfile, updateProfile, uploadProfilePhoto, fetchChefs, fetchPublicChefProfile } from '../services/queries/profileQueries';
import { queryKeys } from '../services/queryKeys';
import type { ChefQueryFilters } from '../types/queryParams';

export function useChefProfile() {
  return useQuery({
    queryKey: queryKeys.chefProfile.me(),
    queryFn: fetchChefProfile
  })
}

export function usePublicChefProfile(slug: string) {
  return useQuery({
    queryKey: queryKeys.publicChefProfile.detail(slug),
    queryFn: () => fetchPublicChefProfile(slug),
  })
}

export function useBrowseChefsQuery(filters: ChefQueryFilters) {
  return useQuery({
    queryKey: ['chefs', filters],
    queryFn: () => fetchChefs(filters),
    enabled: filters.neighborhood !== undefined,
  })
}

export function useUpdateProfileMutation() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: updateProfile,
      onSuccess: (user) => {
        queryClient.setQueryData(queryKeys.auth.me(), user);
      },
    });
  }

export function useUpdateChefProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateChefProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.chefProfile.me()})
    }
  })
}

export function useUploadProfilePhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['auth', 'me']})
    },
  })
}
