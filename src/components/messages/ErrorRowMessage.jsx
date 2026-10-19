import { Button } from "@/components/ui/button"
import { MessageLayout } from "./MessageLayout"

export const ErrorRowMessage = ({
    colSpan,
    error,
    onRetry,
    title = "Gagal memuat data.",
    fallbackMessage = "Terjadi kesalahan, coba lagi nanti.",
}) => (
    <MessageLayout colSpan={colSpan} className="text-destructive">
        <p className="font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">
            {error?.message || fallbackMessage}
        </p>
        {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="mt-3">
                Coba Lagi
            </Button>
        )}
    </MessageLayout>
)