/**
 * Created by lfarfan on 08/03/2017.
 */
declare var BASEURL: string;
export default class LoginService {
    private url: string = `${BASEURL}/services/authentication/`;

    validateSession(usuario: string, clave: string): JQueryXHR {
        return $.ajax({
            url: this.url,
            type: 'POST',
            data: {usuario: usuario, clave: clave},
            beforeSend: (request) => {
                request.setRequestHeader("Authorization", 'ASHASOIH12IOH12IH21O21HI');
            },
        })
    }
}
