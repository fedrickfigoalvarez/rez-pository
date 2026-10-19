import { axiosInstance } from "../../lib/Axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const useFetchProducts = (search = "") => {
    return useQuery({
        queryKey: ["products", search],
        queryFn: async () => {
            const productResponse = await axiosInstance.get("/products", {
                params: search ? { search } : {},
            });
            return productResponse.data;
        },
        placeholderData: keepPreviousData, // Menjaga data sebelumnya tetap tampil saat query berubah (mencegah flickering)
        refetchOnWindowFocus: false,
        retry: false,
    });
};