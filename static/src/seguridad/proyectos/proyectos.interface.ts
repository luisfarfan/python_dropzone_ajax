/**
 * Created by lfarfan on 27/02/2017.
 */
import {ISistema} from '../sistemas/sistemas.interface';
export interface IProyecto {
    anio: number;
    cod_meta: string;
    descripcion: string;
    estado: number;
    fecha_fin: string;
    fecha_inicio: string;
    id: number;
    id_siga: number;
    nombre: string;
    sigla: string;
    sistemas: Array<ISistema>
}
