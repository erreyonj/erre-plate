import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchChefProfile, updateChefProfile, updateProfile, uploadProfilePhoto } from '../services/queries/profileQueries';
import { queryKeys } from '../services/queryKeys';


export function useChefProfile() {
  return useQuery({
    queryKey: queryKeys.chefProfile.me(),
    queryFn: fetchChefProfile
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