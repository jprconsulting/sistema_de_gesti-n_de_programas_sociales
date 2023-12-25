import { AreaAdscripcion } from "./area-adscripcion"

export interface ProgramaSocial {
    id: number
    nombre: string
    descripcion: string
    color: string
    estatus: boolean
    acronimo: string
    areaAdscripcion: AreaAdscripcion
}