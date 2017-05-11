/**
 * Created by lfarfan on 26/02/2017.
 */
declare var BASEURL: string;
interface UrlPermisos {
    permisos: string,
    permisos_proyecto_sistemas: string,
    permisos_genericos: string,
    permisos_byproyectosistema: string,
    permisos_modulorol: string,
    save_permisos_modulorol: string,
}

export class PermisosService {
    private url: UrlPermisos = {
        permisos: `${BASEURL}/rest_modulousuario/permiso/`,
        permisos_proyecto_sistemas: `${BASEURL}/rest_modulousuario/proyecto_sistema_permisos/`,
        permisos_genericos: `${BASEURL}/rest_modulousuario/permisos_genericos/`,
        permisos_byproyectosistema: `${BASEURL}/rest_modulousuario/permisos_proyectosistema/`,
        permisos_modulorol: `${BASEURL}/rest_modulousuario/permisos_modulorol/`,
        save_permisos_modulorol: `${BASEURL}/rest_modulousuario/save_permisos_modulorol/`,
    };

    get(pk: number = null): JQueryXHR {
        return $.ajax({
            url: pk == null ? this.url.permisos : `${this.url.permisos}${pk}/`,
            type: 'GET'
        });
    }

    getGenericos(): JQueryXHR {
        return $.ajax({
            url: this.url.permisos_genericos,
            type: 'GET'
        });
    }

    getModuloRol(rol_id: number, modulo_id: number): JQueryXHR {
        return $.ajax({
            url: `${this.url.permisos_modulorol}${rol_id}/${modulo_id}`,
            type: 'GET'
        });
    }

    getPermisosbyProyectoSistema(id_proyecto: number, id_sistema: number): JQueryXHR {
        return $.ajax({
            url: `${this.url.permisos_proyecto_sistemas}${id_proyecto}/${id_sistema}`,
            type: 'GET'
        });
    }

    getPermisosProyectoSistema(id_proyecto: number, id_sistema: number): JQueryXHR {
        return $.ajax({
            url: `${this.url.permisos_byproyectosistema}${id_proyecto}/${id_sistema}`,
            type: 'GET'
        });
    }

    savePermisosModuloRol(objectData: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url.save_permisos_modulorol}`,
            type: 'POST',
            data: objectData,
        });
    }

    update(pk: number, obj: Array<Object>): JQueryXHR {
        return $.ajax({
            url: `${this.url.permisos}${pk}/`,
            type: 'PUT',
            data: obj
        });
    }

    add(obj: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url.permisos}`,
            type: 'POST',
            data: obj,
        });
    }

    delete(pk: number): JQueryXHR {
        return $.ajax({
            url: `${this.url.permisos}${pk}/`,
            type: 'DELETE',
        });
    }
}
