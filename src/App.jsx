import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Products } from "@/components/products/Products"
import { Toaster } from "@/components/ui/sonner"


export default function App() {
  return (
    <>
      <DashboardLayout title="Dashboard">
        <Products />
      </DashboardLayout>
      <Toaster richColors position="top-right" />
    </>
  )
}
