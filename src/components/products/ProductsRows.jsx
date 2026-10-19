import { TableRow, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyMessage } from "../messages/EmptyMessage"
import { ErrorRowMessage } from "../messages/ErrorRowMessage"
import { EditButton } from "../action-buttons/EditButton"
import { DeleteButton } from "../action-buttons/DeleteButton"
import { cn } from "@/lib/utils"
import { SearchX } from "lucide-react"

const SKELETON_ROW_COUNT = 4
const LOW_STOCK_THRESHOLD = 5

const SKELETON_COLUMNS = [
    { skeleton: "h-4 w-8" },
    { skeleton: "h-4 w-44" },
    { skeleton: "h-4 w-20" },
    { skeleton: "h-4 w-10 mx-auto", cell: "text-center" },
    { skeleton: "h-8 w-28 mx-auto", cell: "text-center" },
]

const COLUMN_COUNT = SKELETON_COLUMNS.length

export const LoadingRows = () =>
    Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
            {SKELETON_COLUMNS.map((col, colIdx) => (
                <TableCell key={colIdx} className={col.cell}>
                    <Skeleton className={col.skeleton} />
                </TableCell>
            ))}
        </TableRow>
    ))

export const EmptyRow = ({ searchTerm, onClearSearch }) => {
    if (searchTerm) {
        return (
            <EmptyMessage
                colSpan={COLUMN_COUNT}
                icon={SearchX}
                message={
                    <div className="flex flex-col items-center gap-1.5 text-center">
                        <p className="font-medium text-foreground">
                            Produk &quot;{searchTerm}&quot; tidak ditemukan.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Coba periksa ejaan atau gunakan kata kunci pencarian lainnya.
                        </p>
                        {onClearSearch && (
                            <button
                                type="button"
                                onClick={onClearSearch}
                                className="mt-1 text-xs text-primary underline underline-offset-4 hover:opacity-80"
                            >
                                Bersihkan pencarian
                            </button>
                        )}
                    </div>
                }
            />
        )
    }

    return (
        <EmptyMessage
            colSpan={COLUMN_COUNT}
            message="Belum ada produk yang tersedia."
        />
    )
}

export const ErrorRow = ({ error, onRetry }) => (
    <ErrorRowMessage
        colSpan={COLUMN_COUNT}
        error={error}
        onRetry={onRetry}
        title="Gagal memuat data produk."
        fallbackMessage="Pastikan backend server berjalan di port 3000."
    />
)

export const ProductRow = ({ product, index }) => {
    const isOutOfStock = product.stok === 0
    const isLowStock = product.stok <= LOW_STOCK_THRESHOLD

    const stockTone = isOutOfStock
        ? "text-red-500"
        : isLowStock
            ? "text-amber-500"
            : "text-foreground"

    return (
        <TableRow>
            <TableCell className="py-1.5 font-medium text-muted-foreground">{index + 1}</TableCell>
            <TableCell className="py-1.5 font-medium text-muted-foreground">{product.product_name}</TableCell>
            <TableCell className="py-1.5 font-medium text-muted-foreground text-center">
                <span className="inline-flex w-24 items-center justify-center rounded-sm bg-secondary px-1 py-0.5 text-xs font-medium text-secondary-foreground">
                    {product.category || "-"}
                </span>
            </TableCell>

            <TableCell className="py-1.5 font-medium text-muted-foreground text-center">
                <span className={cn("inline-flex items-center gap-1.5 font-medium tabular-nums", stockTone)}>
                    {isLowStock && <span className="size-1.5 rounded-full bg-current" />}
                    {isOutOfStock ? "Habis" : product.stok}
                </span>
            </TableCell>

            <TableCell className="text-center py-1.5 font-medium text-muted-foreground">
                <div className="flex items-center justify-center gap-1">
                    <EditButton product={product} />
                    <DeleteButton product={product} />
                </div>
            </TableCell>
        </TableRow>
    )
}