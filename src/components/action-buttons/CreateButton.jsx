import { useState } from "react"
import { Loader2 } from "lucide-react"
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
import { useCreateProduct } from "@/features/products/useCreateProduct"
import {
    createProductSchema,
    INITIAL_VALUES,
    CATEGORIES,
} from "@/features/products/productValidation"

export const CreateButton = () => {
    const [open, setOpen] = useState(false)
    const [formKey, setFormKey] = useState(0)
    const { mutate, isPending, isError, error, reset } = useCreateProduct()

    const handleOpenChange = (nextOpen) => {
        if (isPending) return
        if (nextOpen) {
            setFormKey((k) => k + 1) // fresh Formik instance setiap kali buka
            reset()
            setOpen(true)
        } else {
            setOpen(false)
        }
    }

    const handleSubmit = (values, { resetForm }) => {
        if (isPending) return

        mutate(values, {
            onSuccess: () => {
                toast.success("Produk berhasil ditambahkan", {
                    description: `"${values.product_name.trim()}" sudah masuk ke daftar produk.`,
                })
                resetForm()
                setOpen(false)
            },
            onError: (err) => {
                toast.error("Gagal menyimpan produk", {
                    description:
                        err?.response?.data?.message || err?.message || "Coba lagi beberapa saat.",
                })
            },
        })
    }

    const serverErrorMessage =
        error?.response?.data?.message || error?.message || "Gagal menyimpan produk."

    return (
        <div>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button className="font-semibold">+ Add Product</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                    <Formik
                        key={formKey}
                        initialValues={INITIAL_VALUES}
                        validationSchema={createProductSchema}
                        validateOnBlur={false}
                        validateOnChange={false}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue, setFieldTouched, values, errors, touched }) => (
                            <Form className="flex flex-col gap-3">
                                <DialogHeader>
                                    <DialogTitle>Tambah Produk</DialogTitle>
                                    <DialogDescription>
                                        Isi data produk baru, lalu klik simpan.
                                    </DialogDescription>
                                </DialogHeader>

                                {/* Nama Produk */}
                                <div className="grid gap-1.5">
                                    <Label htmlFor="product_name">Nama Produk</Label>
                                    <Field
                                        as={Input}
                                        id="product_name"
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
                                    <Label htmlFor="category">Kategori</Label>
                                    <Select
                                        value={values.category}
                                        onValueChange={(val) => {
                                            setFieldValue("category", val)
                                            setFieldTouched("category", true, false)
                                        }}
                                        disabled={isPending}
                                    >
                                        <SelectTrigger id="category" className="w-full">
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
                                    <Label htmlFor="stok">Stok</Label>
                                    <Field
                                        as={Input}
                                        id="stok"
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
        </div>
    )
}