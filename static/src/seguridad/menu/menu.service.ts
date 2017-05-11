/**
 * Created by lfarfan on 05/03/2017.
 */
/**
 * Created by lfarfan on 26/02/2017.
 */
declare var BASEURL: string;
interface UrlMenu {
    menubyproject: string,
    menubyprojectsistema: string,
}

export class MenuService {
    private url: UrlMenu = {
        menubyproject: `${BASEURL}/rest_modulousuario/menubyproject/`,
        menubyprojectsistema: `${BASEURL}/rest_modulousuario/menubyprojectsistema/`,
    };

    get(proyecto_id: number): JQueryXHR {
        return $.ajax({
            url: `${this.url.menubyproject}${proyecto_id}`,
            type: 'GET'
        });
    }

    getbyProyectoSistema(proyecto_id: number, sistema_id: number): JQueryXHR {
        return $.ajax({
            url: `${this.url.menubyprojectsistema}${proyecto_id}/${sistema_id}/`,
            type: 'GET'
        });
    }
}
