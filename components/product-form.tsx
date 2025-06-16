"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Loader2, Settings, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ComboboxForm } from "@/components/combobox-form"
import { ImageUpload } from "@/components/image-upload"
import { useToast } from "@/hooks/use-toast"

import { createProduct } from "@/services/product-service";
import { CategoryTreeSelector } from "@/components/category-tree-selector"
import type { Category, CreateProductWoocommerce } from "@/lib/types";
import { getTreeCategories } from "@/services/category-service"
import { createSlug, createTag, homologateCategory, homologateImages } from "@/lib/utils"
import { useCategories } from "@/hooks/useCategories"
import { IMAGE_PRESETS } from "@/lib/image-utils"
import type { ImageProcessingOptions } from "@/lib/image-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

// Datos de ejemplo para los selects
const vehiculos = [
  { label: "Toyota Corolla 2020", value: "toyota-corolla-2020" },
  { label: "Honda Civic 2019", value: "honda-civic-2019" },
  { label: "Ford Mustang 2021", value: "ford-mustang-2021" },
  { label: "Chevrolet Camaro 2018", value: "chevrolet-camaro-2018" },
  { label: "Nissan Sentra 2022", value: "nissan-sentra-2022" },
]

const categoriasPorModelo = [
  { label: "Sedán", value: "sedan" },
  { label: "SUV", value: "suv" },
  { label: "Pickup", value: "pickup" },
  { label: "Hatchback", value: "hatchback" },
  { label: "Deportivo", value: "deportivo" },
]

export function ProductForm() {
  const router = useRouter()
  const { toast } = useToast()

  // Estados del formulario
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [vehiculo, setVehiculo] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [categoriaModelo, setCategoriaModelo] = useState("");
  const { availableCategories, isLoadingCategories, modelCategories } = useCategories();
  // Estados para configuración de imágenes
  const [imagePreset, setImagePreset] = useState<keyof typeof IMAGE_PRESETS>("woocommerce")
  const [showImageSettings, setShowImageSettings] = useState(false)
  const [customImageOptions, setCustomImageOptions] = useState<Partial<ImageProcessingOptions>>({})

  // Estados para controlar las secciones colapsables
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true)
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(true)
  const [isImagesOpen, setIsImagesOpen] = useState(true)

  // Generar SKU basado en selecciones
  const generatedSku =
    vehiculo && selectedCategories.length > 0
      ? `${vehiculo.substring(0, 3)}-${selectedCategories[0].slug.substring(0, 3)}-${Date.now()
        .toString()
        .substring(9, 13)}`
      : ""

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const productData: CreateProductWoocommerce = {
        sku: generatedSku,
        name: (formData.get("nombre") as string).toUpperCase(),
        slug: createSlug(formData.get("nombre") as string),
        description: `NÚMERO DE PARTE:  ${formData.get("numeroParte") as string}`,
        categories: homologateCategory(selectedCategories),
        price: formData.get("precio") as string,
        stock_quantity: Number.parseInt(formData.get("stock") as string),
        tags: [createTag(formData.get("ubicacion") as string)],
        images: homologateImages(images),
        manage_stock: true,
      }

      console.log(productData);
      return;

      // Validaciones básicas
      if (!productData.name || !vehiculo || selectedCategories.length === 0) {
        toast({
          title: "Error de validación",
          description: "Por favor complete todos los campos obligatorios",
          variant: "destructive",
        })
        return
      }

      await createProduct(productData)

      toast({
        title: "Producto creado",
        description: "El producto ha sido creado exitosamente",
      })

      router.push("/productos")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el producto. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (newImage: string) => {
    if (images.length < 4) {
      setImages([...images, newImage])
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const currentPreset = IMAGE_PRESETS[imagePreset]

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección 1: Información Básica */}
        <Collapsible open={isBasicInfoOpen} onOpenChange={setIsBasicInfoOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <span>Información Básica</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isBasicInfoOpen ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vehiculo">Búsqueda por modelo *</Label>
                    <ComboboxForm
                      id="vehiculo"
                      options={modelCategories.map(category => ({ label: category.name, value: category.id.toString() }))}
                      value={vehiculo}
                      onChange={setVehiculo}
                      placeholder="Seleccione un vehículo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" value={generatedSku} disabled className="bg-muted" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nombre">Nombre Producto *</Label>
                    <Input id="nombre" name="nombre" placeholder="Ingrese el nombre del producto" required />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="categorias">Categoría por parte *</Label>
                    {isLoadingCategories ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2 text-sm text-muted-foreground">Cargando categorías...</span>
                      </div>
                    ) : (
                      <CategoryTreeSelector
                        categories={availableCategories}
                        selectedCategories={selectedCategories}
                        onSelectionChange={setSelectedCategories}
                      />
                    )}
                  </div>

                  {/* <div className="space-y-2">
                    <Label htmlFor="categoriaModelo">Categoría por Modelo</Label>
                    <ComboboxForm
                      id="categoriaModelo"
                      options={categoriasPorModelo}
                      value={categoriaModelo}
                      onChange={setCategoriaModelo}
                      placeholder="Seleccione un modelo"
                    />
                  </div> */}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Sección 2: Detalles del Producto */}
        <Collapsible open={isProductDetailsOpen} onOpenChange={setIsProductDetailsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <span>Detalles del Producto</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isProductDetailsOpen ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <Input id="ubicacion" name="ubicacion" placeholder="Ingrese la ubicación" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numeroParte">Número de Parte</Label>
                    <Input id="numeroParte" name="numeroParte" placeholder="Ingrese el número de parte" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio</Label>
                    <Input id="precio" name="precio" type="number" placeholder="0.00" min="0" step="0.01" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" name="stock" type="number" placeholder="0" min="0" step="1" required />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Sección 3: Imágenes */}
        <Collapsible open={isImagesOpen} onOpenChange={setIsImagesOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <span>Imágenes del Producto</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {currentPreset.width}x{currentPreset.height}px
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowImageSettings(!showImageSettings)
                      }}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isImagesOpen ? "rotate-180" : ""}`} />
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-4">
                  {/* Configuración de imágenes */}
                  {showImageSettings && (
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Configuración de Optimización</Label>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setShowImageSettings(false)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="imagePreset">Preset de Optimización</Label>
                              <Select
                                value={imagePreset}
                                onValueChange={(value) => setImagePreset(value as keyof typeof IMAGE_PRESETS)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="woocommerce">WooCommerce (800x536px) - Recomendado</SelectItem>
                                  <SelectItem value="gallery">Galería (1200x800px) - Alta calidad</SelectItem>
                                  <SelectItem value="thumbnail">Miniatura (300x200px) - Rápida carga</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Información del Preset</Label>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>
                                  Dimensiones: {currentPreset.width}x{currentPreset.height}px
                                </p>
                                <p>Calidad: {Math.round(currentPreset.quality * 100)}%</p>
                                <p>Formato: {currentPreset.format.split("/")[1].toUpperCase()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="text-sm text-muted-foreground">
                    Máximo 4 imágenes. Las imágenes se optimizarán automáticamente para mejorar el rendimiento y la
                    experiencia del usuario.
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <Card key={index} className="relative overflow-hidden">
                        <CardContent className="p-0">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Producto ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}

                    {images.length < 4 && (
                      <ImageUpload
                        onImageCapture={handleImageUpload}
                        preset={imagePreset}
                        customOptions={customImageOptions}
                        showCompressionInfo={true}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
          <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Producto
          </Button>
        </div>
      </form>
    </div>
  )
}
