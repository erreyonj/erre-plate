import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../services/queries/profileQueries';
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