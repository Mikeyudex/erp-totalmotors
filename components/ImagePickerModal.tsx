import { useState, useRef } from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import CameraUploader, { CameraUploaderRef } from "./camera-preview"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { IMAGE_PRESETS } from "@/lib/image-utils"

interface ImagePickerModalProps {
    currentCount: number
    onImageCapture: (imageData: string) => void
    preset: keyof typeof IMAGE_PRESETS
    customOptions?: object
    showCompressionInfo?: boolean
}

export function ImagePickerModal({
    currentCount,
    onImageCapture,
    preset,
    customOptions,
    showCompressionInfo = false,
}: ImagePickerModalProps) {
    const cameraRef = useRef<CameraUploaderRef>(null)
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState<"camera" | "upload" | null>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const remaining = 4 - currentCount
        const selected = Array.from(files).slice(0, remaining)

        for (const file of selected) {
            const reader = new FileReader()
            reader.onload = async () => {
                if (typeof reader.result === "string") {
                    await onImageCapture(reader.result)
                }
            }
            reader.readAsDataURL(file)
        }

        setOpen(false)
    }

    const closeModal = () => {
        setOpen(false)
        setMode(null)
        cameraRef.current?.stopCamera()
    }


    const handleCameraCapture = async (dataUrl: string) => {
        await onImageCapture(dataUrl)
        closeModal()
    }

    return (
        <Dialog open={open} onOpenChange={(openState) => {
            if (!openState) {
                closeModal()
            } else {
                setOpen(true)
            }
        }}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={currentCount >= 4}
                    className="w-full h-32 border-dashed"
                >
                    Agregar imágenes
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Selecciona una opción</DialogTitle>
                </DialogHeader>

                {!mode && (
                    <div className="flex flex-col gap-4 mt-4">
                        <Button variant="outline" onClick={() => setMode("upload")}>
                            📁 Subir desde tu dispositivo
                        </Button>
                        <Button variant="outline" onClick={() => setMode("camera")}>
                            📷 Usar cámara
                        </Button>
                    </div>
                )}

                {mode === "upload" && (
                    <div className="space-y-4 mt-4">
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                        <Button variant="secondary" onClick={() => setMode(null)}>
                            ← Volver
                        </Button>
                    </div>
                )}

                {mode === "camera" && (
                    <div className="space-y-4">
                        <CameraUploader
                            ref={cameraRef}
                            onImageCapture={handleCameraCapture}
                            preset={preset}
                            customOptions={customOptions}
                            showCompressionInfo={showCompressionInfo}
                        />
                        <Button variant="secondary" onClick={closeModal}>
                            ← Volver
                        </Button>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
