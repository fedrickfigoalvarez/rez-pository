import { useState } from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFetchProducts } from "@/features/products/useFetchProducts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, Search, X } from "lucide-react"
import { LoadingRows, EmptyRow, ErrorRow, ProductRow } from "./ProductsRows"
import { CreateButton } from "../action-buttons/CreateButton"
import { useDebounce } from "@/hooks/useDebounce"
import { toast } from "sonner"

export const Products = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [isRefreshing, setIsRefreshing] = useState(false)
    const debouncedSearch = useDebounce(searchTerm, 400)

    const {
        data: products = [],
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useFetchProducts(debouncedSearch)

    const handleClearSearch = () => {
        setSearchTerm("")
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            await refetch()
            toast.success("Data berhasil disinkronkan")
        } catch {
            toast.error("Gagal menyinkronkan data")
        } finally {
            setTimeout(() => {
                setIsRefreshing(false)
            }, 500)
        }
    }

    const renderBody = () => {
        if (isLoading && products.length === 0) return <LoadingRows />
        if (isError) return <ErrorRow error={error} onRetry={refetch} />
        if (products.length === 0) {
            return (
                <EmptyRow
                    searchTerm={debouncedSearch}
                    onClearSearch={handleClearSearch}
                />
            )
        }
        return products.map((product, index) => (
            <ProductRow key={product.id} product={product} index={index} />
        ))
    }

    const isBusy = isFetching || isRefreshing

    return (
        <div className="flex flex-col gap-4 max-w-5xl w-full">
            {/* Header + Refresh Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Products Dashboard</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Daftar seluruh produk inventaris yang tersinkronisasi dari backend.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isBusy}
                    className="gap-2 self-start sm:self-auto cursor-pointer"
                >
                    <RefreshCw className={`size-3.5 ${isBusy ? "animate-spin" : ""}`} />
                    <span>{isBusy ? "Memuat..." : "Refresh"}</span>
                </Button>
            </div>

            {/* Action Bar: CreateButton di kiri, Search Input di kanan */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CreateButton />

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Cari produk / kategori..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 pr-8 h-9 text-sm"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                            aria-label="Hapus pencarian"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Table dengan horizontal scroll di mobile */}
            <div className="rounded-md border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className={`min-w-150 sm:min-w-full transition-opacity duration-200 ${isBusy && products.length > 0 ? "opacity-60" : "opacity-100"}`}>
                        <TableHeader className="[&_th]:h-9 [&_th]:text-md [&_th]:tracking-wide">
                            <TableRow>
                                <TableHead className="w-16">No</TableHead>
                                <TableHead>Nama Produk</TableHead>
                                <TableHead className="text-center w-32">Kategori</TableHead>
                                <TableHead className="text-center w-24">Stok</TableHead>
                                <TableHead className="text-center w-28">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>{renderBody()}</TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}