import { Beneficiario } from "./beneficiario"

export interface Visita {
    id: number
    descripcion: string
    foto: string
    imagenBase64: string
    beneficiario: Beneficiario
}