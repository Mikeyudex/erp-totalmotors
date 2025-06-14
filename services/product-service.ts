import type { Category, PaginatedResponse, PaginationParams, Product } from "@/lib/types"
import { getToken } from "./auth-service";

// URL base de la API (en producción, esto vendría de variables de entorno)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com";
const username = process.env.NEXT_PUBLIC_USERNAME || "admin@example.com";
const password = process.env.NEXT_PUBLIC_PASSWORD || "";


// Categorías disponibles
export const availableCategories: Category[] = [
    { id: "1", name: "Motor", slug: "motor" },
    { id: "2", name: "Transmisión", slug: "transmision" },
    { id: "3", name: "Suspensión", slug: "suspension" },
    { id: "4", name: "Frenos", slug: "frenos" },
    { id: "5", name: "Carrocería", slug: "carroceria" },
    { id: "6", name: "Eléctrico", slug: "electrico" },
    { id: "7", name: "Refrigeración", slug: "refrigeracion" },
    { id: "8", name: "Combustible", slug: "combustible" },
    { id: "9", name: "Escape", slug: "escape" },
    { id: "10", name: "Interior", slug: "interior" },
]
// Datos de ejemplo para simular respuestas de la API
const mockProducts: Product[] = [
    {
        id: "1",
        sku: "toy-mot-1234",
        nombre: "Alternador Toyota Corolla",
        categorias: [
            { id: "1", name: "Motor", slug: "motor" },
            { id: "6", name: "Eléctrico", slug: "electrico" },
        ],
        modelo: "Sedán",
        precio: 1250.0,
        stock: 5,
        ubicacion: "Almacén A, Estante 3",
        numeroParte: "ALT-2020-TC",
    },
    {
        id: "2",
        sku: "hon-sus-5678",
        nombre: "Amortiguador Honda Civic",
        categorias: [{ id: "3", name: "Suspensión", slug: "suspension" }],
        modelo: "Sedán",
        precio: 850.0,
        stock: 8,
        ubicacion: "Almacén B, Estante 1",
        numeroParte: "AM-2019-HC",
    },
    {
        id: "3",
        sku: "for-fre-9012",
        nombre: "Disco de Freno Ford Mustang",
        categorias: [{ id: "4", name: "Frenos", slug: "frenos" }],
        modelo: "Deportivo",
        precio: 1800.0,
        stock: 3,
        ubicacion: "Almacén A, Estante 5",
        numeroParte: "DF-2021-FM",
    },
    {
        id: "4",
        sku: "nis-car-3456",
        nombre: "Parachoques Nissan Sentra",
        categorias: [{ id: "4", name: "Frenos", slug: "frenos" }],
        modelo: "Sedán",
        precio: 3200.0,
        stock: 2,
        ubicacion: "Almacén C, Estante 2",
        numeroParte: "PC-2022-NS",
    },
    {
        id: "5",
        sku: "che-tra-7890",
        nombre: "Caja de Cambios Chevrolet Camaro",
        categorias: [{ id: "4", name: "Frenos", slug: "frenos" }],
        modelo: "Deportivo",
        precio: 4500.0,
        stock: 1,
        ubicacion: "Almacén B, Estante 4",
        numeroParte: "CC-2018-CC",
    },
    {
        id: "6",
        sku: "toy-ele-2468",
        nombre: "Batería Toyota RAV4",
        categorias: [{ id: "4", name: "Frenos", slug: "frenos" }],
        modelo: "SUV",
        precio: 950.0,
        stock: 7,
        ubicacion: "Almacén A, Estante 1",
        numeroParte: "BAT-2021-TR",
    },
    {
        id: "7",
        sku: "hon-mot-1357",
        nombre: "Bomba de Agua Honda Accord",
        categorias: [{ id: "4", name: "Frenos", slug: "frenos" }],
        modelo: "Sedán",
        precio: 750.0,
        stock: 4,
        ubicacion: "Almacén B, Estante 2",
        numeroParte: "BA-2020-HA",
    },
    {
        id: "8",
        sku: "for-ele-2468",
        nombre: "Alternador Ford Explorer",
        categorias: [{ id: "4", name: "Frenos", slug: "frenos" }],
        modelo: "SUV",
        precio: 1350.0,
        stock: 3,
        ubicacion: "Almacén A, Estante 4",
        numeroParte: "ALT-2019-FE",
    },
    {
        id: "9",
        sku: "nis-sus-3579",
        nombre: "Resortes Nissan Frontier",
        categorias: [{ id: "4", name: "Frenos", slug: "frenos" }],
        modelo: "Pickup",
        precio: 980.0,
        stock: 6,
        ubicacion: "Almacén C, Estante 1",
        numeroParte: "RES-2022-NF",
    },
    {
        id: "10",
        sku: "che-fre-8642",
        nombre: "Pastillas de Freno Chevrolet Spark",
        categorias: [{ id: "4", name: "Frenos", slug: "frenos" }],
        modelo: "Hatchback",
        precio: 450.0,
        stock: 12,
        ubicacion: "Almacén B, Estante 3",
        numeroParte: "PF-2021-CS",
    },
    {
        id: "11",
        sku: "toy-car-9753",
        nombre: "Puerta Delantera Toyota Hilux",
        categorias: [{ id: "4", name: "Frenos", slug: "frenos" }],
        modelo: "Pickup",
        precio: 2800.0,
        stock: 2,
        ubicacion: "Almacén D, Estante 1",
        numeroParte: "PD-2020-TH",
    },
    {
        id: "12",
        sku: "hon-tra-8642",
        nombre: "Embrague Honda HR-V",
        categorias: [{ id: "4", name: "Frenos", slug: "frenos" }],
        modelo: "SUV",
        precio: 1650.0,
        stock: 3,
        ubicacion: "Almacén B, Estante 5",
        numeroParte: "EMB-2021-HH",
    },
    {
        id: "13",
        sku: "for-mot-7531",
        nombre: "Radiador Ford F-150",
        categorias: [{ id: "4", name: "Frenos", slug: "frenos" }],
        modelo: "Pickup",
        precio: 1250.0,
        stock: 4,
        ubicacion: "Almacén A, Estante 2",
        numeroParte: "RAD-2019-FF",
    },
    {
        id: "14",
        sku: "nis-ele-6420",
        nombre: "Alternador Nissan Versa",
        categorias: [{ id: "4", name: "Frenos", slug: "frenos" }],
        modelo: "Sedán",
        precio: 890.0,
        stock: 5,
        ubicacion: "Almacén C, Estante 3",
        numeroParte: "ALT-2022-NV",
    },
    {
        id: "15",
        sku: "che-sus-5309",
        nombre: "Amortiguadores Chevrolet Trax",
        categorias: [{ id: "4", name: "Frenos", slug: "frenos" }],
        modelo: "SUV",
        precio: 1100.0,
        stock: 6,
        ubicacion: "Almacén B, Estante 1",
        numeroParte: "AM-2020-CT",
    },
]


/**
 * Obtiene todas las categorías disponibles
 */
export async function getCategories(): Promise<Category[]> {
    try {
        // En un entorno real, haríamos una solicitud fetch a la API
        // const response = await fetch(`${API_URL}/categories`);
        // if (!response.ok) throw new Error('Error al obtener categorías');
        // return await response.json();

        // Simulamos una respuesta con las categorías disponibles
        await new Promise((resolve) => setTimeout(resolve, 200)) // Simular latencia de red

        return availableCategories
    } catch (error) {
        console.error("Error al obtener categorías:", error)
        throw error
    }
}

/**
 * Obtiene un listado paginado de productos
 */
export async function getProducts(params: PaginationParams): Promise<PaginatedResponse<Product>> {
    try {
        let token = await getToken(username, password);
        const response = await fetch(`${API_URL}/api/products?page=${params.page}&limit=${params.limit}&search=${params.search || ''}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Error al obtener productos');
        let data = await response.json();
        let productsData = data?.products ?? [];
        let paginationData = data?.pagination ?? {};

        let mappedData = productsData.map((product: any) => {
            return {
                id: product.id,
                sku: product.sku,
                nombre: product.name,
                categorias: product?.categories,
                modelo: product.model,
                precio: parseInt(product.price),
                stock: product?.stock_quantity || 0,
                ubicacion: product?.location || "",
                numeroParte: product?.part_number || "",
                imagenes: product?.images || [],
            }
        });

        return {
            data: mappedData,
            meta: {
                currentPage: paginationData?.current_page || 0,
                totalPages: paginationData?.total_pages || 0,
                totalItems: paginationData?.total_items || 0,
                itemsPerPage: paginationData?.per_page || 0,
            },
        }
    } catch (error) {
        console.error("Error al obtener productos:", error)
        throw error
    }
}

/**
 * Obtiene un producto por su ID
 */
export async function getProductById(id: string): Promise<Product> {
    try {
        // En un entorno real, haríamos una solicitud fetch a la API
        // const response = await fetch(`${API_URL}/products/${id}`);
        // if (!response.ok) throw new Error('Error al obtener el producto');
        // return await response.json();

        // Simulamos una respuesta con los datos de ejemplo
        await new Promise((resolve) => setTimeout(resolve, 300)) // Simular latencia de red

        const product = mockProducts.find((p) => p.id === id)
        if (!product) {
            throw new Error("Producto no encontrado")
        }

        return product
    } catch (error) {
        console.error(`Error al obtener el producto con ID ${id}:`, error)
        throw error
    }
}

/**
 * Crea un nuevo producto
 */
export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
    try {
        // En un entorno real, haríamos una solicitud POST a la API
        // const response = await fetch(`${API_URL}/products`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(product),
        // });
        // if (!response.ok) throw new Error('Error al crear el producto');
        // return await response.json();

        // Simulamos una respuesta exitosa
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simular latencia de red

        const newProduct = {
            id: `new-${Date.now()}`,
            ...product,
        }

        return newProduct
    } catch (error) {
        console.error("Error al crear el producto:", error)
        throw error
    }
}

/**
 * Actualiza un producto existente
 */
export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
        // En un entorno real, haríamos una solicitud PUT a la API
        // const response = await fetch(`${API_URL}/products/${id}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(product),
        // });
        // if (!response.ok) throw new Error('Error al actualizar el producto');
        // return await response.json();

        // Simulamos una respuesta exitosa
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simular latencia de red

        const existingProduct = mockProducts.find((p) => p.id === id)
        if (!existingProduct) {
            throw new Error("Producto no encontrado")
        }

        const updatedProduct = {
            ...existingProduct,
            ...product,
        }

        return updatedProduct
    } catch (error) {
        console.error(`Error al actualizar el producto con ID ${id}:`, error)
        throw error
    }
}

/**
 * Elimina un producto
 */
export async function deleteProduct(id: string): Promise<void> {
    try {
        // En un entorno real, haríamos una solicitud DELETE a la API
        // const response = await fetch(`${API_URL}/products/${id}`, {
        //   method: 'DELETE',
        // });
        // if (!response.ok) throw new Error('Error al eliminar el producto');

        // Simulamos una respuesta exitosa
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simular latencia de red

        const productIndex = mockProducts.findIndex((p) => p.id === id)
        if (productIndex === -1) {
            throw new Error("Producto no encontrado")
        }

        // En un entorno real, el producto se eliminaría en el servidor
        console.log(`Producto con ID ${id} eliminado correctamente`)
    } catch (error) {
        console.error(`Error al eliminar el producto con ID ${id}:`, error)
        throw error
    }
}
