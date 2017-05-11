/**
 * Created by lfarfan on 26/02/2017.
 */
export interface IPermiso {
    id: number,
    nombre: string;
    descripcion: string;
    codigo: string;
    dom_name_sufijo: string,
    proyectosistema_id: number,
}

export interface IPermisos extends Array<IPermiso> {
}

