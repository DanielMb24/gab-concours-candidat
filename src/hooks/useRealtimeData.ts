
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useEffect } from 'react';

export const useRealtimeData = () => {
  const queryClient = useQueryClient();

  // Refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['admin-concours'] });
      queryClient.invalidateQueries({ queryKey: ['admin-candidats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['admin-paiements'] });
    }, 30000);

    return () => clearInterval(interval);
  }, [queryClient]);

  const { data: concoursData, isLoading: concoursLoading } = useQuery({
    queryKey: ['admin-concours'],
    queryFn: () => apiService.getConcours(),
    refetchInterval: 30000,
  });

  const { data: candidatsData, isLoading: candidatsLoading } = useQuery({
    queryKey: ['admin-candidats'],
    queryFn: () => apiService.getCandidats(),
    refetchInterval: 30000,
  });

  const { data: statisticsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-statistics'],
    queryFn: () => apiService.getStatistics(),
    refetchInterval: 30000,
  });

  const { data: paiementsData, isLoading: paiementsLoading } = useQuery({
    queryKey: ['admin-paiements'],
    queryFn: () => apiService.getPaiements(),
    refetchInterval: 30000,
  });

  return {
    concours: concoursData?.data || [],
    candidats: candidatsData?.data || [],
    statistics: statisticsData?.data || { candidats: 0, concours: 0, etablissements: 0, participations: 0, paiements: 0 },
    paiements: paiementsData?.data || [],
    isLoading: concoursLoading || candidatsLoading || statsLoading || paiementsLoading,
  };
};
