/**
 * Created by lfarfan on 19/02/2017.
 */
import {SessionHelper, ObjectHelper} from '../core/helper.inei';
import {showDivAlert} from '../core/utils'
var sessionHelper = new SessionHelper();
var objectHelper = new ObjectHelper();
declare var BASEURL: any;
$('#iniciar_sesion').on('click', event => {
    "use strict";
    let url = `${BASEURL}/services/authentication/`;
    let data = {usuario: $('#usuario').val(), clave: $('#clave').val()};
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: response => {
            if (objectHelper.isEmpty(response)) {
                $('#div_error_message').html(showDivAlert('Usuario o contraseña no validos', 'danger'))
            } else {
                $('#div_error_message').html(showDivAlert('Bienvenido!', 'success'));
                $('#iniciar_sesion').addClass('disabled');
                setTimeout(() => {
                    sessionHelper.setSession('usuario', response);
                    let session = sessionHelper.getSession();
                    window.location.href = `${BASEURL}/${session.routes[1].slug}`;
                }, 1000)
            }
        }
    });
});

