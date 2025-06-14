"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Camera, Plus, Upload, Loader2, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useImageProcessor } from "@/hooks/use-image-processor"
import { formatFileSize, IMAGE_PRESETS } from "@/lib/image-utils"
import type { ImageProcessingOptions } from "@/lib/image-utils"

interface ImageUploadProps {
  onImageCapture: (imageUrl: string) => void
  preset?: keyof typeof IMAGE_PRESETS
  customOptions?: Partial<ImageProcessingOptions>
  showCompressionInfo?: boolean
}

export function ImageUpload({
  onImageCapture,
  preset = "woocommerce",
  customOptions,
  showCompressionInfo = true,
}: ImageUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState<{
    originalSize: number
    compressedSize: number
    compressionRatio: number
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const { toast } = useToast()

  const { processSingleImage, processImageFromDataUrl, isProcessing, progress } = useImageProcessor({
    preset,
    customOptions,
    onError: (error) => {
      toast({
        title: "Error al procesar imagen",
        description: error,
        variant: "destructive",
      })
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const processedImage = await processSingleImage(file)

        // Mostrar información de compresión
        if (showCompressionInfo) {
          setCompressionInfo({
            originalSize: processedImage.originalSize,
            compressedSize: processedImage.compressedSize,
            compressionRatio: processedImage.compressionRatio,
          })

          toast({
            title: "Imagen procesada",
            description: `Tamaño reducido en ${processedImage.compressionRatio.toFixed(1)}% (${formatFileSize(
              processedImage.originalSize,
            )} → ${formatFileSize(processedImage.compressedSize)})`,
          })
        }

        onImageCapture(processedImage.dataUrl)
        setIsDialogOpen(false)
      } catch (error) {
        // El error ya se maneja en el hook
      }
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
        setIsCameraActive(true)
      }
    } catch (err) {
      toast({
        title: "Error de cámara",
        description: "No se pudo acceder a la cámara",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsCameraActive(false)
    }
  }

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Configurar el canvas con las dimensiones del video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Dibujar el frame actual del video en el canvas
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convertir el canvas a una URL de datos
        const imageUrl = canvas.toDataURL("image/jpeg", 0.9)

        try {
          // Procesar la imagen capturada
          const processedImage = await processImageFromDataUrl(imageUrl)

          // Mostrar información de compresión
          if (showCompressionInfo) {
            setCompressionInfo({
              originalSize: processedImage.originalSize,
              compressedSize: processedImage.compressedSize,
              compressionRatio: processedImage.compressionRatio,
            })

            toast({
              title: "Foto procesada",
              description: `Imagen optimizada: ${processedImage.dimensions.width}x${processedImage.dimensions.height}px`,
            })
          }

          onImageCapture(processedImage.dataUrl)

          // Cerrar el diálogo y detener la cámara
          stopCamera()
          setIsDialogOpen(false)
        } catch (error) {
          // El error ya se maneja en el hook
        }
      }
    }
  }

  const handleDialogClose = () => {
    stopCamera()
    setIsDialogOpen(false)
  }

  const currentPreset = IMAGE_PRESETS[preset]

  return (
    <>
      <Card className="cursor-pointer border-dashed" onClick={() => setIsDialogOpen(true)}>
        <CardContent className="flex flex-col items-center justify-center p-6 h-32">
          <Plus className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">Agregar foto</p>
          {showCompressionInfo && (
            <Badge variant="outline" className="mt-1 text-xs">
              {currentPreset.width}x{currentPreset.height}px
            </Badge>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Agregar imagen
              {showCompressionInfo && (
                <Badge variant="secondary" className="text-xs">
                  {currentPreset.width}x{currentPreset.height}px
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Procesando imagen...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {isCameraActive ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-full">
                <video ref={videoRef} className="w-full rounded-md" autoPlay playsInline />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex justify-center space-x-2">
                <Button onClick={capturePhoto} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Capturar"}
                </Button>
                <Button variant="outline" onClick={stopCamera} disabled={isProcessing}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {showCompressionInfo && (
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p>Las imágenes se optimizarán automáticamente:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>
                          Redimensionadas a {currentPreset.width}x{currentPreset.height}px
                        </li>
                        <li>Comprimidas para reducir el tamaño</li>
                        <li>Optimizadas para tiendas online</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col h-24 items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  <Upload className="h-8 w-8 mb-2" />
                  <span>Subir imagen</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col h-24 items-center justify-center"
                  onClick={startCamera}
                  disabled={isProcessing}
                >
                  <Camera className="h-8 w-8 mb-2" />
                  <span>Usar cámara</span>
                </Button>
              </div>

              {compressionInfo && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Última imagen procesada:</strong>
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Tamaño reducido en {compressionInfo.compressionRatio.toFixed(1)}% (
                    {formatFileSize(compressionInfo.originalSize)} → {formatFileSize(compressionInfo.compressedSize)})
                  </p>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={isProcessing}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
