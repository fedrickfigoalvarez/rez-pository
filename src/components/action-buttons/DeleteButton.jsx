import { useState } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDeleteProduct } from "@/features/products/useDeleteProduct"

export const DeleteButton = ({ product }) => {
    const [open, setOpen] = useState(false)
    const { mutate, isPending } = useDeleteProduct()

    const handleOpenChange = (nextOpen) => {
        if (isPending) return // jangan bisa ditutup saat request jalan
        setOpen(nextOpen)
    }

    const handleDelete = (e) => {
        e.preventDefault() // cegah dialog nutup otomatis, kita tutup manual setelah sukses
        if (isPending) return

        mutate(product.id, {
            onSuccess: () => {
                toast.success("Produk berhasil dihapus", {
                    description: `"${product.product_name}" sudah dihapus dari daftar.`,
                })
                setOpen(false)
            },
            onError: (err) => {
                toast.error("Gagal menghapus produk", {
                    description:
                        err?.response?.data?.message || err?.message || "Coba lagi beberapa saat.",
                })
            },
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Hapus produk"
                    className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                    <Trash2 className="size-4" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus produk ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Produk <span className="font-semibold text-foreground">{product.product_name}</span> akan
                        dihapus permanen dan gak bisa dikembalikan.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {isPending && <Loader2 className="size-4 animate-spin" />}
                        {isPending ? "Menghapus..." : "Ya, hapus"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}