
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

export const useDataRefresh = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    // Refresh all queries when route changes
    queryClient.invalidateQueries();
  }, [location.pathname, queryClient]);
};
