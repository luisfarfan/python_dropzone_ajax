/**
 * Created by lfarfan on 19/02/2017.
 */
declare var BASEURL: string;
interface UrlProyectos {
    proyectos: string;
    sistemas_proyecto: string;
}

export class ProyectosService {
    private url: UrlProyectos = {
        proyectos: `${BASEURL}/rest_proyectos/proyecto/`,
        sistemas_proyecto: `${BASEURL}/rest_proyectos/sistemas_proyecto/`,
    }

    getProyectos(pk: any = null): JQueryXHR {
        return $.ajax({
            url: pk == null ? this.url.sistemas_proyecto : `${this.url.sistemas_proyecto}${pk}/`,
            type: 'GET'
        });
    }

    addProyecto(objectData: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url.proyectos}`,
            type: 'POST',
            data: objectData,
        });
    }

    updateProyecto(pk: number, objectData: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url.proyectos}/${pk}`,
            type: 'PATCH',
            data: objectData,
        });
    }

    deleteProyecto(pk: number): JQueryXHR {
        return $.ajax({
            url: `${this.url.proyectos}/${pk}`,
            type: 'DELETE',
        });
    }
}

interface UrlSistema {
    sistemas: string;
    sistemas_menu: string;
}
export class SistemasService {
    private url: UrlSistema = {
        sistemas: `${BASEURL}/rest_sistemas/sistema/`,
        sistemas_menu: `${BASEURL}/rest_sistemas/sistema/`,
    }

    getSistemas(pk: any = null): JQueryXHR {
        return $.ajax({
            url: pk == null ? this.url.sistemas : `${this.url.sistemas}${pk}/`,
            type: 'GET'
        });
    }

    addSistema(objectData: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url.sistemas}`,
            type: 'POST',
            data: objectData,
        });
    }

    updateSistema(pk: any, objectData: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url.sistemas}/${pk}`,
            type: 'PATCH',
            data: objectData,
        });
    }

    deleteSistema(pk: any): JQueryXHR {
        return $.ajax({
            url: `${this.url.sistemas}/${pk}`,
            type: 'DELETE',
        });
    }
}

interface UrlModulo {
    modulo: string;
    proyecto_sistema_modulos: string;
}
export class ModuloService {
    private url: UrlModulo = {
        modulo: `${BASEURL}/rest_modulousuario/modulo/`,
        proyecto_sistema_modulos: `${BASEURL}/rest_modulousuario/proyecto_sistema_modulos/`,
    }

    getModulos(pk: number = null): JQueryXHR {
        return $.ajax({
            url: pk == null ? this.url.modulo : `${this.url.modulo}${pk}/`,
            type: 'GET'
        });
    }

    addModulo(objectData: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url.modulo}`,
            type: 'POST',
            data: objectData,
        });
    }

    updateModulo(pk: number, objectData: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url.modulo}${pk}/`,
            type: 'PATCH',
            data: objectData,
        });
    }

    deleteModulo(pk: number): JQueryXHR {
        return $.ajax({
            url: `${this.url.modulo}${pk}/`,
            type: 'DELETE',
        });
    }

    getModulosRecursive(id_proyecto: number, id_sistema: number) {
        return $.ajax({
            url: `${this.url.proyecto_sistema_modulos}${id_proyecto}/${id_sistema}/`,
            type: 'GET'
        });
    }
}
