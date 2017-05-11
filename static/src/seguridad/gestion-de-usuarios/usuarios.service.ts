/**
 * Created by Administrador on 6/03/2017.
 */

declare var BASEURL: string;
interface UrlUsuario {
    usuario: string,
    usuario_detalle: string,
    save_rol: string,
}
export class UsuarioService {
    private url: UrlUsuario = {
        usuario: `${BASEURL}/rest_usuario/usuario/`,
        usuario_detalle: `${BASEURL}/rest_usuario/usuario_detalle/`,
        save_rol: `${BASEURL}/usuario/saveRol/`,
    };

    get(pk: number = null): JQueryXHR {
        return $.ajax({
            url: pk == null ? this.url.usuario_detalle : `${this.url.usuario_detalle}${pk}/`,
            type: 'GET'
        });
    }

    update(pk: number, obj: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url.usuario}${pk}/`,
            type: 'PUT',
            data: obj
        });
    }

    add(obj: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url.usuario}`,
            type: 'POST',
            data: obj,
        });
    }

    saveRol(rol: number, user_id: number) {
        return $.ajax({
            url: `${this.url.save_rol}`,
            type: 'POST',
            data: {rol_id: rol, user_id: user_id},
        });
    }

    delete(pk: number): JQueryXHR {
        return $.ajax({
            url: `${this.url.usuario}${pk}/`,
            type: 'DELETE',
        });
    }
}
