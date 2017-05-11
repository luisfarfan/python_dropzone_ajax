/**
 * Created by lfarfan on 29/01/2017.
 */
export function showDivAlert(message, type) {
    return `<div class="alert bg-${type} alert-styled-left">
                <button type="button" class="close" data-dismiss="alert"><span>×</span><span class="sr-only">Close</span></button>
                <span class="text-semibold">${message}</span>
            </div>`;
}

export function showSwalAlert(message, title, type) {
    new PNotify({
        title: title,
        text: message,
        type: type
    });
}

export function jsonFormatFancyTree(menu_json, rol_id_array = []) {
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
     * **/
    let treejson = [];
    let interface_node = {};
    menu_json.map((value, key) => {
        interface_node = {};
        interface_node['title'] = value.descripcion;
        interface_node['key'] = value.id;
        if (value.modulos_hijos.length) {
            interface_node['folder'] = true;
            interface_node['children'] = [];
            let children = [];
            value.modulos_hijos.map((node_value, node_order) => {
                children.push({
                    'title': node_value.descripcion,
                    'key': node_value.id,
                    'folder': node_value.modulos_hijos.length == 0 ? false : true,
                    'children': node_value.modulos_hijos.length == 0 ? [] : jsonFormatFancyTree(node_value.modulos_hijos),
                    'selected': rol_id_array.indexOf(node_value.id) != -1 ? true : false,
                    'preselected': rol_id_array.indexOf(node_value.id) != -1 ? true : false
                });
            });
            interface_node['children'] = children;
            treejson.push(interface_node);
        } else {
            interface_node['folder'] = false;
            treejson.push(interface_node);
        }
    });
    return treejson;
}

export function validateForm(id_form, rules) {
    let setOptions = {
        ignore: 'input[type=hidden], .select2-search__field', // ignore hidden fields
        errorClass: 'validation-error-label',
        successClass: 'validation-valid-label',
        highlight: function (element, errorClass) {
            $(element).removeClass(errorClass);
        },
        unhighlight: function (element, errorClass) {
            $(element).removeClass(errorClass);
        },

        // Different components require proper error label placement
        errorPlacement: function (error, element) {

            // Styled checkboxes, radios, bootstrap switch
            if (element.parents('div').hasClass("checker") || element.parents('div').hasClass("choice") || element.parent().hasClass('bootstrap-switch-container')) {
                if (element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
                    error.appendTo(element.parent().parent().parent().parent());
                } else {
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
                            } else {
                                error.insertAfter(element);
                            }
        },
        validClass: "validation-valid-label",
        success: function (label) {
            label.addClass("validation-valid-label").text("Success.");
        },
        rules: {}
    };

    setOptions.rules = rules;
    return setOptions;
}

export function serializeForm(id_form) {
    let objectForm = $(`#${id_form}`).serializeArray();
    let checkboxes = $('input:checkbox');
    if (checkboxes.length) {
        checkboxes.map((value, key) => {
            objectForm.append({ value: $(key).is(':checked') ? 1 : 0, name: key.name });
        });
    }

    return objectForm;
}