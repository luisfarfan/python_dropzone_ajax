/**
 * Created by LFarfan on 19/12/2016.
 */
import { SessionHelper, ObjectHelper } from './helper.inei.js';
import { showDivAlert } from './util.inei.js';
var sessionHelper = new SessionHelper();
var objectHelper = new ObjectHelper();
$('#iniciar_sesion').on('click', event => {
    "use strict";

    let url = `${BASEURL}/usuario/authentication/`;
    let data = { usuario: $('#usuario').val(), clave: $('#clave').val() };
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: response => {
            if (objectHelper.isEmpty(response)) {
                //mostrar div error
                $('#div_error_message').html(showDivAlert('Usuario o contraseña no validos', 'danger'));
            } else {
                $('#div_error_message').html(showDivAlert('Bienvenido!', 'success'));
                $('#iniciar_sesion').addClass('disabled');
                setTimeout(() => {
                    sessionHelper.setSession('usuario', response);
                    let session = sessionHelper.getSession();
                    window.location.href = `${BASEURL}/${session.routes[2].slug}`;
                }, 1000);
            }
        }
    });
});