/**
 * Created by Administrador on 22/02/2017.
 */

import {IModulo} from '../menu/menu.interface';
import {IPermiso} from '../permisos/permisos.interface'


export interface IRol {
    id: number;
    modulo_rol: Array<any>;
    nombre: string;
    descripcion: string;
    codigo: string,
    rol: number,
}

export interface IModuloRol {
    id: number,
    modulo: IModulo,
    permisos: IPermiso[],
    rol: number,
}