import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/Axios";

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...body }) => {
            const response = await axiosInstance.patch(`/products/${id}`, {
                ...body,
                stok: parseInt(body.stok),
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

