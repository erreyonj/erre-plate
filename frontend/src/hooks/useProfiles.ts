import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchChefProfile, updateChefProfile, updateProfile, uploadProfilePhoto, fetchChefs, fetchPublicChefProfile } from '../services/queries/profileQueries';
import { queryKeys } from '../services/queryKeys';


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
    enabled: !!slug, // prevents undefined firing
  })
}

export function useBrowseChefsQuery(neighborhoodId: number | null) {
  return useQuery({
    queryKey: ['chefs', { neighborhoodId }],
    queryFn: () =>
      fetchChefs({
        neighborhood: neighborhoodId,
      }),
    enabled: neighborhoodId !== undefined, // prevents weird early calls
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
      // refetch authenticated user
      queryClient.invalidateQueries({queryKey: ['auth', 'me']})
    },
  })
}