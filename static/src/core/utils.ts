/**
 * Declarando la variable PNotify, plugin javascript para las alertas en modo popup.
 */
declare var PNotify: any;
/**
 * Declarando la variable swal, plugin javascript para las alertas en modo popup.
 */
declare var swal: any;
/**
 * Declarando la variable $ de jQuery para poder usarla sin problemas
 * cuando se quiere usar alguna funcion que no este en la interface del jQuery Typings de TypeScript
 */
declare var $: any;
import {IModulo} from '../seguridad/menu/menu.interface'
/**
 * div alert de limitless para mostrar mensajes de estado (exito,error,info,warning)
 * @param message Mensaje del div.
 * @param type Tipo del div (error, success, info, danger, warning)
 * @returns      <Div> HTMLElement String.
 */
export function showDivAlert(message: string, type: string): string {
    return `<div class="alert bg-${type} alert-styled-left">
                <button type="button" class="close" data-dismiss="alert"><span>×</span><span class="sr-only">Close</span></button>
                <span class="text-semibold">${message}</span>
            </div>`;
}

/**
 * Popup alert notify para mostrar mensajes de estado (exito,error,info,warning)
 * @param message Mensaje del div.
 * @param type Tipo del div (error, success, info, danger, warning)
 * @returns      <Div> HTMLElement String.
 */
export function showSwalAlert(message: string, title: string, type: string) {
    new PNotify({
        title: title,
        text: message,
        type: type
    });
}
export function alert_confirm(callback: any, title = 'Está seguro de Guardar?', type = 'success') {
    swal({
        title: title,
        text: '',
        type: type,
        showCancelButton: true,
        confirmButtonColor: "#EF5350",
        confirmButtonText: "Si!",
        cancelButtonText: "No!",
        closeOnConfirm: true,
        closeOnCancel: true,
        showLoaderOnConfirm: true
    }, (confirm: any) => {
        if (confirm) {
            callback()
        }
    });
}
/**
 * sample structure
 * [
 *  {title: "node1"},{title: "node2"},{title:"node3", folder:true,key:"__node3"},
 *      children: [
 *          {title: "sub_node1",
     *              children: [
     *                  {title: "sub_node2"},{title: "sub_node3"},{title: "sub_node4"}]}]]
 *
 *
 **/
export function jsonFormatFancyTree(menu_json: any, rol_id_array: Array<number> = []) {
    let treejson: Array<any> = [];
    let interface_node: any = {};
    menu_json.map((value: any, key: any) => {
        interface_node = {};
        interface_node['title'] = value.descripcion;
        interface_node['key'] = value.id;
        interface_node['icon'] = value.icon;
        if (value.modulos_hijos.length) {
            interface_node['children'] = [];
            let children: Array<any> = [];
            value.modulos_hijos.map((node_value: any, node_order: any) => {
                children.push({
                    'title': node_value.descripcion,
                    'key': node_value.id,
                    'children': node_value.modulos_hijos.length == 0 ? [] : jsonFormatFancyTree(node_value.modulos_hijos, rol_id_array),
                    'selected': rol_id_array.indexOf(node_value.id) != -1 ? true : false,
                    'preselected': rol_id_array.indexOf(node_value.id) != -1 ? true : false,
                    'icon': node_value.icon,
                });
            });
            interface_node['children'] = children;
            treejson.push(interface_node);
        } else {
            interface_node['children'] = [];
            interface_node['selected'] = rol_id_array.indexOf(value.id) != -1 ? true : false;
            interface_node['preselected'] = rol_id_array.indexOf(value.id) != -1 ? true : false;
            treejson.push(interface_node);
        }
    });
    return treejson;
}


export function jsonFormatFancyTreeSelecteds(menu_json: IModulo[], rol_id_array: Array<number> = []) {
    let treejson: Array<any> = [];
    let interface_node: any = {};
    menu_json.map((value: IModulo, key: any) => {
        if (findChilds(value, rol_id_array)) {
            interface_node = {};
            interface_node['title'] = value.descripcion;
            interface_node['key'] = value.id;
            interface_node['icon'] = value.icon;
            interface_node['children'] = [];
            let children: Array<any> = [];
            value.modulos_hijos.map((node_value: IModulo, node_order: any) => {
                if (findChilds(node_value, rol_id_array)) {
                    children.push({
                        'title': node_value.descripcion,
                        'key': node_value.id,
                        'children': node_value.modulos_hijos.length == 0 ? [] : jsonFormatFancyTreeSelecteds(node_value.modulos_hijos, rol_id_array),
                        'selected': false,
                        'preselected': false,
                        'icon': node_value.icon,
                    });
                }
            });
            interface_node['children'] = children;
            treejson.push(interface_node);
        }
    });
    return treejson;
}

function findChilds(menu: IModulo, rol_id_array: Array<number>): boolean {
    let has_child: boolean = false;
    let count: number = 0;
    if (rol_id_array.indexOf(menu.id) != -1) {
        count++;
    } else {
        if (menu.modulos_hijos.length) {
            menu.modulos_hijos.map((value: IModulo, key: number) => {
                if (rol_id_array.indexOf(value.id) != -1) {
                    count++;
                } else {
                    findChilds(value, rol_id_array);
                }
            });
        }
    }

    return has_child = count > 0;
}

export function validateForm(rules: Object) {
    let setOptions = {
        ignore: 'input[type=hidden], .select2-search__field', // ignore hidden fields
        errorClass: 'validation-error-label',
        successClass: 'validation-valid-label',
        highlight: function (element: any, errorClass: any) {
            $(element).removeClass(errorClass);
        },
        unhighlight: function (element: any, errorClass: any) {
            $(element).removeClass(errorClass);
        },

        // Different components require proper error label placement
        errorPlacement: function (error: any, element: any) {

            // Styled checkboxes, radios, bootstrap switch
            if (element.parents('div').hasClass("checker") || element.parents('div').hasClass("choice") || element.parent().hasClass('bootstrap-switch-container')) {
                if (element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
                    error.appendTo(element.parent().parent().parent().parent());
                }
                else {
                    error.appendTo(element.parent().parent().parent().parent().parent());
                }
            }

            // Unstyled checkboxes, radios
            else if (element.parents('div').hasClass('checkbox') || element.parents('div').hasClass('radio')) {
                error.appendTo(element.parent().parent().parent());
            }

            // Input with icons and Select2
            else if (element.parents('div').hasClass('has-feedback') || element.hasClass('select2-hidden-accessible')) {
                error.appendTo(element.parent());
            }

            // Inline checkboxes, radios
            else if (element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
                error.appendTo(element.parent().parent());
            }

            // Input group, styled file input
            else if (element.parent().hasClass('uploader') || element.parents().hasClass('input-group')) {
                error.appendTo(element.parent().parent());
            }

            else {
                error.insertAfter(element);
            }
        },
        validClass: "validation-valid-label",
        success: function (label: any) {
            label.addClass("validation-valid-label").text("Correcto!")
        },
        rules: {},
        messages: {
            custom: {
                required: "El campo es requerido",
            },
        }
    };

    setOptions.rules = rules
    return setOptions;
}

export function serializeForm(id_form: string) {
    let objectForm: Array<Object> = $(`#${id_form}`).serializeArray();
    let checkboxes = $(`#${id_form} input:checkbox`);
    // let datesinputs = $(`#${id_form} input[type="date"]`);
    if (checkboxes.length) {
        checkboxes.map((value: any, key: any) => {
            objectForm.push({value: $(key).is(':checked') ? 1 : 0, name: key.name})
        });
    }
    return objectForm;
}
interface optionsTable {
    edit_name: string,
    delete_name: string,
    enumerar: boolean,
    table_id: string
}
export function drawTable(data: Array<Object>, campos: Array<string>, pk: string = null, options: optionsTable = {
    edit_name: null,
    delete_name: null,
    enumerar: null,
    table_id: null
}) {
    let html: string = '';
    data.map((value: any, key: number) => {
        html += `<tr>`;

        html += options.enumerar ? `<td>${key + 1}</td>` : '';
        campos.map((val: any, pos: any) => {
            html += `<td>${value[val]}</td>`;
        })
        if (options !== null) {
            if (options.edit_name !== null || options.delete_name !== null) {
                html += `<td><ul class="icons-list">
                            ${options.edit_name !== '' ? `<li name="${options.edit_name}" data-value=${value[pk]} class="text-primary-600"><a><i class="icon-pencil7"></i></a></li>` : ''}
                            ${options.delete_name !== '' ? `<li name="${options.delete_name}" data-value=${value[pk]} class="text-danger-600"><a><i class="icon-trash"></i></a></li>` : ''}
						 </ul></td>`;
            }

        }
        html += `</tr>`;
    })
    $(`#${options.table_id}`).find('tbody').html(html);
}

interface CamposSelect {
    id: string,
    text: String[],
}
interface ExtraOptionsDrowdown {
    id_element: string,
    bootstrap_multiselect: boolean,
    select2: boolean,
}
/**
 * Componente que renderiza un element Dropdown.
 * @param data Data a iterar, tiene que ser una lista de Object (Array<Object>)
 * @param campos Vienen a ser las KEYS de cada objecto en la lista del parametro "data"
 * @param extra Opciones extras.
 * @returns      <Div> HTMLElement String.
 */
export function setDropdown(data: Array<Object>, campos: CamposSelect, extra: ExtraOptionsDrowdown) {
    let html = `<option value="-1">Seleccione</option>`;
    data.map((value: any, key: number) => {
        let value_concated: string = '';
        campos.text.map((v: string, k: number) => {
            value_concated += `${value[v]} `
        });
        html += `<option value="${value[campos.id]}">${value_concated}</option>`
    });
    $(`#${extra.id_element}`).html(html);
    if (extra.bootstrap_multiselect) {
        $(`#${extra.id_element}`).selectpicker('destroy')
        $(`#${extra.id_element}`).selectpicker('render')
    }
    extra.select2 ? $(`#${extra.id_element}`).select2() : '';
}

export function formToObject(form: Array<Object>) {
    let formObject: any = {};
    form.map((value: any, key: any) => {
        formObject[value.name] = value.value;
    });
    return formObject;
}

export function showInfo(message: String) {
    swal(message);
}