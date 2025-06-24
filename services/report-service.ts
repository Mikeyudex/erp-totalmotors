import type {
  ReportResponse,
  ReportFilters,
  ProductCreationReport,
  ReportUser,
  ReportSummary,
} from "@/lib/report-types"

// URL base de la API (en producción, esto vendría de variables de entorno)
const API_URL = process.env.NEXT_PUBLIC_ENV === "LOCAL" ? process.env.NEXT_PUBLIC_API_URL_LOCAL  : process.env.NEXT_PUBLIC_API_URL
const username = process.env.NEXT_PUBLIC_USERNAME || "admin@example.com";
const password = process.env.NEXT_PUBLIC_PASSWORD || "";

// Datos de ejemplo para simular respuestas de la API
const mockUsers: ReportUser[] = [
  { id: "1", name: "Juan Pérez", email: "juan@example.com", role: "admin" },
  { id: "2", name: "María García", email: "maria@example.com", role: "user" },
  { id: "3", name: "Carlos López", email: "carlos@example.com", role: "user" },
  { id: "4", name: "Ana Martínez", email: "ana@example.com", role: "user" },
  { id: "5", name: "Luis Rodríguez", email: "luis@example.com", role: "admin" },
]

// Generar datos de ejemplo para reportes
const generateMockReportData = (filters: ReportFilters): ProductCreationReport[] => {
  const reports: ProductCreationReport[] = []
  const startDate = new Date(filters.startDate || "2024-01-01")
  const endDate = new Date(filters.endDate || "2024-12-31")

  // Generar datos para cada día en el rango
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0]

    // Filtrar usuarios si se especifica
    const usersToProcess = filters.userId ? mockUsers.filter((u) => u.id === filters.userId) : mockUsers

    usersToProcess.forEach((user) => {
      // Simular actividad aleatoria (algunos días sin actividad)
      const hasActivity = Math.random() > 0.3
      if (hasActivity) {
        const productsCount = Math.floor(Math.random() * 8) + 1 // 1-8 productos
        const productsList = Array.from({ length: productsCount }, (_, i) => ({
          id: `prod_${user.id}_${dateStr}_${i}`,
          name: `Producto ${i + 1} - ${dateStr}`,
          sku: `SKU-${user.id}-${dateStr.replace(/-/g, "")}-${i + 1}`,
          createdAt: `${dateStr}T${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:00Z`,
        }))

        reports.push({
          id: `report_${user.id}_${dateStr}`,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          date: dateStr,
          productsCreated: productsCount,
          productsList,
        })
      }
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Obtiene los usuarios disponibles para el filtro
 */
export async function getReportUsers(): Promise<ReportUser[]> {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Error al obtener usuarios');
    let data = await response.json();
    let mapUsers: ReportUser[] = data?.map((user: any) => ({
      id: user?._id,
      name: `${user?.nombre} ${user?.apellido}`,
      email: user?.email,
      role: user?.rol || "operativo",
    })) || [];
    return mapUsers;
  } catch (error) {
    console.error("Error al obtener usuarios para reportes:", error)
    throw error
  }
}

/**
 * Obtiene el reporte de creación de productos
 */
export async function getProductCreationReport(filters: ReportFilters): Promise<ReportResponse> {
  try {
    const queryParams = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
      ...(filters.userId && { user_id: filters.userId }),
      ...(filters.startDate && { start_date: filters.startDate }),
      ...(filters.endDate && { end_date: filters.endDate }),
    })

    const response = await fetch(`${API_URL}/reports/products?${queryParams}`)

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Error ${response.status}: ${error}`)
    }

    const data = await response.json()
    return data as ReportResponse
  } catch (error) {
    console.error("Error al obtener el reporte de creación de productos:", error)
    throw error
  }
}

/**
 * Exporta el reporte completo a CSV
 */
export async function exportProductCreationReportCSV(filters: Omit<ReportFilters, "page" | "limit">): Promise<string> {
  try {
    // En un entorno real, haríamos una solicitud fetch a la API
    // const queryParams = new URLSearchParams({
    //   ...(filters.userId && { userId: filters.userId }),
    //   ...(filters.startDate && { startDate: filters.startDate }),
    //   ...(filters.endDate && { endDate: filters.endDate }),
    //   format: 'csv'
    // });
    // const response = await fetch(`${API_URL}/reports/product-creation/export?${queryParams}`);
    // if (!response.ok) throw new Error('Error al exportar reporte');
    // return await response.text();

    // Simulamos la generación de CSV
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const allReports = generateMockReportData({ ...filters, page: 1, limit: 1000 })

    // Generar CSV
    const headers = ["Fecha", "Usuario", "Email", "Productos Creados", "Lista de Productos (SKUs)"]
    const csvRows = [headers.join(",")]

    allReports.forEach((report) => {
      const productSkus = report.productsList.map((p) => p.sku).join("; ")
      const row = [
        report.date,
        `"${report.userName}"`,
        report.userEmail,
        report.productsCreated.toString(),
        `"${productSkus}"`,
      ]
      csvRows.push(row.join(","))
    })

    return csvRows.join("\n")
  } catch (error) {
    console.error("Error al exportar reporte a CSV:", error)
    throw error
  }
}
