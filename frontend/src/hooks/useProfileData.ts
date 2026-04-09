import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clickService } from "../services/clickService";
import { linksService } from "../services/linksService";
import { profileService } from "../services/profileService";

export function useProfileData(username?: string) {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", username],
    queryFn: () => profileService.get(username || ""),
    enabled: Boolean(username)
  });

  const clickMutation = useMutation({
    mutationFn: (linkId: string) => clickService.track(linkId)
  });

  const reorderLinksMutation = useMutation({
    mutationFn: (ids: string[]) => linksService.reorder(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
    }
  });

  return { profileQuery, clickMutation, reorderLinksMutation };
}
