import { useState } from "react"
import { Loader2, Pencil } from "lucide-react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useUpdateProduct } from "@/features/products/useUpdateProduct"
import {
    createProductSchema,
    CATEGORIES,
} from "@/features/products/productValidation"

export const EditButton = ({ product }) => {
    const [open, setOpen] = useState(false)
    const [formKey, setFormKey] = useState(0)
    const { mutate, isPending, isError, error, reset } = useUpdateProduct()

    // Pre-fill form dengan data produk saat ini
    const initialValues = {
        product_name: product.product_name ?? "",
        category: product.category ?? "",
        stok: product.stok?.toString() ?? "",
    }

    const handleOpenChange = (nextOpen) => {
        if (isPending) return
        if (nextOpen) {
            setFormKey((k) => k + 1)
            reset()
            setOpen(true)
        } else {
            setOpen(false)
        }
    }

    const handleSubmit = (values) => {
        if (isPending) return

        mutate(
            { id: product.id, ...values },
            {
                onSuccess: () => {
                    toast.success("Produk berhasil diperbarui", {
                        description: `"${values.product_name.trim()}" telah diperbarui.`,
                    })
                    setOpen(false)
                },
                onError: (err) => {
                    toast.error("Gagal memperbarui produk", {
                        description:
                            err?.response?.data?.message ||
                            err?.message ||
                            "Coba lagi beberapa saat.",
                    })
                },
            }
        )
    }

    const serverErrorMessage =
        error?.response?.data?.message || error?.message || "Gagal memperbarui produk."

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Edit produk"
                >
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <Formik
                    key={formKey}
                    initialValues={initialValues}
                    validationSchema={createProductSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, setFieldTouched, values, errors, touched }) => (
                        <Form className="flex flex-col gap-3">
                            <DialogHeader>
                                <DialogTitle>Edit Produk</DialogTitle>
                                <DialogDescription>
                                    Ubah data produk, lalu klik simpan.
                                </DialogDescription>
                            </DialogHeader>

                            {/* Nama Produk */}
                            <div className="grid gap-1.5">
                                <Label htmlFor={`edit_name_${product.id}`}>Nama Produk</Label>
                                <Field
                                    as={Input}
                                    id={`edit_name_${product.id}`}
                                    name="product_name"
                                    disabled={isPending}
                                />
                                <ErrorMessage
                                    name="product_name"
                                    component="p"
                                    className="text-sm text-destructive"
                                />
                            </div>

                            {/* Kategori */}
                            <div className="grid gap-1.5">
                                <Label htmlFor={`edit_cat_${product.id}`}>Kategori</Label>
                                <Select
                                    value={values.category}
                                    onValueChange={(val) => {
                                        setFieldValue("category", val)
                                        setFieldTouched("category", true, false)
                                    }}
                                    disabled={isPending}
                                >
                                    <SelectTrigger
                                        id={`edit_cat_${product.id}`}
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {touched.category && errors.category && (
                                    <p className="text-sm text-destructive">{errors.category}</p>
                                )}
                            </div>

                            {/* Stok */}
                            <div className="grid gap-1.5">
                                <Label htmlFor={`edit_stok_${product.id}`}>Stok</Label>
                                <Field
                                    as={Input}
                                    id={`edit_stok_${product.id}`}
                                    name="stok"
                                    type="number"
                                    min="0"
                                    disabled={isPending}
                                />
                                <ErrorMessage
                                    name="stok"
                                    component="p"
                                    className="text-sm text-destructive"
                                />
                            </div>

                            {/* Server Error */}
                            {isError && (
                                <p role="alert" className="text-sm text-destructive">
                                    {serverErrorMessage}
                                </p>
                            )}

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={isPending}>
                                        Batal
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={isPending}>
                                    {isPending && <Loader2 className="size-4 animate-spin" />}
                                    {isPending ? "Menyimpan..." : "Simpan"}
                                </Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}

