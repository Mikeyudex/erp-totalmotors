export interface Category {
    id: string
    name: string
    slug: string
}

// Tipos para los productos
export interface Product {
    id: string
    sku: string
    nombre: string
    categorias: Category[]
    modelo: string
    precio: number
    stock: number
    ubicacion?: string
    numeroParte?: string
    imagenes?: string[]
}

// Tipos para la respuesta paginada
export interface PaginatedResponse<T> {
    data: T[]
    meta: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    }
}

// Parámetros para la paginación
export interface PaginationParams {
    page: number
    limit: number
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
}
