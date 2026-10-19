import { axiosInstance } from "../../lib/Axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body) => {
            const productResponse = await axiosInstance.post("/products", {
                ...body,
                stok: parseInt(body.stok),
            });
            return productResponse.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};