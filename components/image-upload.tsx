"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Camera, Plus, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ImageUploadProps {
  onImageCapture: (imageUrl: string) => void
}

export function ImageUpload({ onImageCapture }: ImageUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        onImageCapture(reader.result as string)
        setIsDialogOpen(false)
      }
      reader.readAsDataURL(file)
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
      console.error("Error al acceder a la cámara:", err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsCameraActive(false)
    }
  }

  const capturePhoto = () => {
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
        const imageUrl = canvas.toDataURL("image/jpeg")
        onImageCapture(imageUrl)

        // Cerrar el diálogo y detener la cámara
        stopCamera()
        setIsDialogOpen(false)
      }
    }
  }

  const handleDialogClose = () => {
    stopCamera()
    setIsDialogOpen(false)
  }

  return (
    <>
      <Card className="cursor-pointer border-dashed" onClick={() => setIsDialogOpen(true)}>
        <CardContent className="flex flex-col items-center justify-center p-6 h-32">
          <Plus className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Agregar foto</p>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar imagen</DialogTitle>
          </DialogHeader>

          {isCameraActive ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-full">
                <video ref={videoRef} className="w-full rounded-md" autoPlay playsInline />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex justify-center space-x-2">
                <Button onClick={capturePhoto}>Capturar</Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col h-24 items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mb-2" />
                  <span>Subir imagen</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col h-24 items-center justify-center"
                  onClick={startCamera}
                >
                  <Camera className="h-8 w-8 mb-2" />
                  <span>Usar cámara</span>
                </Button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
