import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile, uploadProfilePhoto } from '../services/queries/profileQueries';
import { queryKeys } from '../services/queryKeys';


export function useUpdateProfileMutation() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: updateProfile,
      onSuccess: (user) => {
        queryClient.setQueryData(queryKeys.auth.me(), user);
      },
    });
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