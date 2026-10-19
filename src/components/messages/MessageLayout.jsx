import { TableRow, TableCell } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export const MessageLayout = ({ colSpan = 1, className, children, ...props }) => (
    <TableRow>
        <TableCell
            colSpan={colSpan}
            className={cn("h-32 text-center", className)}
            {...props}
        >
            {children}
        </TableCell>
    </TableRow>
)