/**
 * Created by Administrador on 6/03/2017.
 */
import {IRol} from '../usuarios.roles/roles_permisos.interface'
export interface IUsuario {
    id: number,
    dni: number,
    ape_pat: string,
    ape_mat: string,
    nombre: string,
    fecha_contrato_inicio: string,
    fecha_contrato_extended: string,
    fecha_contrato_fin: string,
    fecha_nacimiento: string,
    email_inst: string,
    email_personal: string,
    usuario: string,
    clave: string,
    tipousuario: ITipoUsuario,
    activo: number,
    rol: IRol
}
export interface ITipoUsuario {
    id: number,
    nombre: string,
    descripcion: string,
}