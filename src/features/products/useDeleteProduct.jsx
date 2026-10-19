import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/Axios";

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => axiosInstance.delete(`/products/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};