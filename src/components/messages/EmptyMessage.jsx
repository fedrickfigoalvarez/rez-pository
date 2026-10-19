import { PackageX } from "lucide-react"
import { MessageLayout } from "./MessageLayout"

export const EmptyMessage = ({
    colSpan,
    icon: Icon = PackageX,
    message = "Belum ada data yang tersedia.",
}) => (
    <MessageLayout colSpan={colSpan} className="text-muted-foreground">
        <div className="flex flex-col items-center justify-center gap-2">
            <Icon className="size-8 opacity-40" />
            {typeof message === "string" ? <p>{message}</p> : message}
        </div>
    </MessageLayout>
)