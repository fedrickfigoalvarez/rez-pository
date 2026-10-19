import * as Yup from "yup";

export const CATEGORIES = [
  "Makanan",
  "Gadget",
  "Elektronik",
  "Fashion",
  "Lainnya",
];

export const createProductSchema = Yup.object().shape({
  product_name: Yup.string()
    .trim()
    .required("Nama produk wajib diisi")
    .min(2, "Nama produk minimal 2 karakter")
    .max(100, "Nama produk maksimal 100 karakter"),
  category: Yup.string()
    .required("Kategori wajib dipilih")
    .oneOf(CATEGORIES, "Kategori tidak valid"),
  stok: Yup.number()
    .typeError("Stok harus berupa angka")
    .required("Stok wajib diisi")
    .min(0, "Stok tidak boleh negatif")
    .integer("Stok harus bilangan bulat"),
});

export const INITIAL_VALUES = {
  product_name: "",
  category: "",
  stok: "",
};
