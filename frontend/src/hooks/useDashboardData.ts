import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { analyticsService } from "../services/analyticsService";
import { linksService } from "../services/linksService";
import { themeService } from "../services/themeService";
import { ThemeConfig } from "../types";

export function useDashboardData(selectedLinkId: string) {
  const queryClient = useQueryClient();

  const linksQuery = useQuery({
    queryKey: ["links"],
    queryFn: linksService.list
  });

  const themeQuery = useQuery({
    queryKey: ["theme"],
    queryFn: themeService.get
  });

  const analyticsQuery = useQuery({
    queryKey: ["analytics", selectedLinkId],
    queryFn: () => analyticsService.get(selectedLinkId)
  });

  const createLinkMutation = useMutation({
    mutationFn: linksService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] })
  });

  const updateLinkMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { title?: string; url?: string } }) => linksService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] })
  });

  const deleteLinkMutation = useMutation({
    mutationFn: (id: string) => linksService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  const reorderLinksMutation = useMutation({
    mutationFn: (ids: string[]) => linksService.reorder(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] })
  });

  const updateThemeMutation = useMutation({
    mutationFn: (payload: ThemeConfig) => themeService.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["theme"] })
  });

  return {
    linksQuery,
    themeQuery,
    analyticsQuery,
    createLinkMutation,
    updateLinkMutation,
    deleteLinkMutation,
    reorderLinksMutation,
    updateThemeMutation
  };
}
