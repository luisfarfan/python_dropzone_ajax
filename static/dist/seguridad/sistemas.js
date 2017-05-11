/**
 * Created by LFarfan on 21/12/2016.
 */

var sistemas = [];
var sistema_selected = {};

$(function () {
    "use strict";

    getSistemas();
});

$('#btn_agregar_sistema').on('click', event => {
    "use strict";

    sistema_selected = {};
    $('form').trigger('reset');
    $('#modal_sistemas').modal('show');
});

function getSistemas() {
    "use strict";

    let html = '';
    $('#tbl_sistemas').find('tbody').empty();
    $.ajax({
        url: `${BASE_URL}/rest_sistemas/sistema/`,
        type: 'GET',
        success: response => {
            sistemas = response;
            let html = '';
            $.each(sistemas, (key, val) => {
                html += `<tr>
                            <td>${val.id}</td>
                            <td>${val.codigo}</td>
                            <td>${val.descripcion == null ? '' : val.descripcion}</td>
                            <td>${val.nombre}</td>
                            <td>${val.estado == 1 ? '<span class="label label-success">Activo</span>' : '<span class="label label-danger">Inactivo</span>'}</td>
                            <td>
                               <ul class="icons-list">
                                    <li><a data-popup="tooltip" onclick="modal_editarSistema(${val.id})" title="" data-original-title="Editar Proyecto"><i class="icon-pencil7"></i></a></li>
                                    <li><a data-popup="tooltip" onclick="confirm_eliminarSistema(${val.id})" title="" data-original-title="Asignar Sistemas"><i class="icon-trash"></i></a></li>
						        </ul>
						    </td>`;
                html += `</tr>`;
            });
            $('#tbl_sistemas').find('tbody').html(html);
        }
    });
}

function modal_editarSistema(id) {
    "use strict";

    sistema_selected = findInObject(sistemas, 'id', id);
    objectToForm(sistema_selected[0]);
    $('#modal_sistemas').modal('show');
}

function eliminarSistema() {
    "use strict";

    let options = {
        url: `${BASEURL}/rest_sistemas/sistema/${sistema_selected[0].id}`,
        type: 'DELETE',
        success: () => {
            getSistemas();
        }
    };
    $.ajax(options);
}

function confirm_eliminarSistema(id) {
    sistema_selected = findInObject(sistemas, 'id', id);
    "use strict";
    alert_confirm(eliminarSistema, 'Está seguro de eliminar el sistema?', 'warning');
}

function saveSistema() {
    "use strict";

    let options = {};
    if (sistema_selected.length) {
        options.url = `${BASEURL}/rest_sistemas/sistema/${sistema_selected[0].id}/`;
        options.type = 'PUT';
        options.data = formToObject('form_save');
    } else {
        options.url = `${BASEURL}/rest_sistemas/sistema/`;
        options.type = 'POST';
        options.data = formToObject('form_save');
    }
    options.success = response => {
        getSistemas();
        $('#modal_sistemas').modal('hide');
    };
    $.ajax(options);
}

$('#btn_save_sistema').on('click', event => {
    "use strict";

    alert_confirm(saveSistema);
});