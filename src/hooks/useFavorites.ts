import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  type FavoriteItem,
} from "../services/favoritesService";
import { appLogger } from "../lib/logger";

export const useFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: Omit<FavoriteItem, "id" | "user_id" | "created_at">) =>
      addFavorite(item),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      appLogger.success(
        "ARCHIVE",
        `Item saved to personal archive: ${variables.type}`,
      );
    },
    onError: (error) => {
      appLogger.error("ARCHIVE", `Failed to save item: ${error.message}`);
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      appLogger.info("ARCHIVE", "Item removed from archive");
    },
  });
};
