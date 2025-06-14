import type { Metadata } from "next"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CategoriesDataTable } from "@/components/categories-data-table"

export const metadata: Metadata = {
  title: "Categorías",
  description: "Gestión de categorías",
}

export default function CategoriasPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/categorias/crear">
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Categoría
          </Link>
        </Button>
      </div>
      <CategoriesDataTable />
    </div>
  )
}
