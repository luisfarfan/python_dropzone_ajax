/**
 * Created by lfarfan on 05/03/2017.
 */
export interface IModulo {
    id: number;
    nombre: string;
    descripcion: string;
    slug: string;
    codigo: string;
    template_html: string;
    is_padre: number;
    icon: string;
    proyectosistema: number;
    modulo_padre: number;
    modulos_hijos: IModulo[]
}
