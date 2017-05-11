import {ProyectosService, SistemasService, ModuloService} from './menu-aplicaciones.service';
import * as utils from '../../core/utils';
import {IProyecto, ISistema, ISistemas, IProyectos, IModulo} from './menu-aplicaciones.interfaces';
import {ObjectHelper, SessionHelper} from '../../core/helper.inei';

declare var $: any;
var objectHelper = new ObjectHelper();
var proyectosService = new ProyectosService();
var sistemasService = new SistemasService();
var moduloService = new ModuloService();

var form_modulo_validate: any;
var proyectos: IProyectos;
var sistemas: ISistemas;
var sistema_selected: ISistema;
var proyecto_selected: IProyecto;
var modulosRecursive: any;
var modulo_selected: any;
var key_tree_node_selected: number = null;
var jsonRulesModuloForm: Object = {
    nombre: {
        maxlength: 100
    },
    descripcion: {
        maxlength: 255
    },
    slug: {
        maxlength: 50
    },
    codigo: {
        maxlength: 8
    },
    template_html: {
        maxlength: 255
    },
    icon: {
        maxlength: 100
    },
}
var addModulo: boolean = false;
var updateModulo: boolean = false;

var MenuAplicacionesController: any = {
    getProyectos: (byPk: string) => {
        proyectosService.getProyectos(byPk).done(data => {
            proyectos = data;
            let html = '';
            proyectos.map((value, key) => {
                html += `<tr data-value="${value.id}"><td>${value.sigla}</td><td>${value.anio}</td><td>${value.nombre}</td></tr>`;
            })

            $('#table_proyectos').find('tbody').html(html);
            $('#table_proyectos').find('tr').on('click', (event: any) => {
                MenuAplicacionesController.getSistemasbyProyecto($(event.currentTarget).data('value'));
            });
        }).fail((error: any) => {
            utils.showSwalAlert('Ocurrio un error!', 'Error', 'error');
        });
    },
    getSistemasbyProyecto: (by: string) => {
        proyecto_selected = objectHelper.findInArrayObject(proyectos, by, 'id');
        let html = '';
        sistemas = proyecto_selected.sistemas;
        sistemas.map((value: ISistema, key: any) => {
            html += `<tr data-value="${value.id}"><td>${key + 1}</td><td>${value.nombre}</td></tr>`;
        });
        $('#table_sistemas').find('tbody').html(html);
        $('#table_sistemas').find('tr').on('click', (event: any) => {
            sistema_selected = objectHelper.findInArrayObject(sistemas, $(event.currentTarget).data('value'), 'id');
            MenuAplicacionesController.getModuloRecursive();
        });
    },
    getSistemas: (byPk: string) => {
        sistemasService.getSistemas(byPk).done(data => {
            sistemas = data;
        }).fail((error: any) => {
            utils.showSwalAlert('Ocurrio un error!', 'Error', 'error');
        })
    },
    getModuloRecursive: () => {
        moduloService.getModulosRecursive(proyecto_selected.id, sistema_selected.id).done(data => {
            modulosRecursive = data;
            let treeFormat = utils.jsonFormatFancyTree(data);
            let options_tree = {
                checkbox: false,
                selectMode: 1,
                source: treeFormat,
                beforeSelect: function (event: any, data: any) {
                    if (data.node.folder) {
                        return false;
                    }
                },
                select: function (event: any, data: any) {
                    // Display list of selected nodes
                    var selNodes = data.tree.getSelectedNodes();
                    // convert to title/key array
                    selNodes.length == 0 ? key_tree_node_selected = null : '';
                    var selKeys = $.map(selNodes, function (node: any) {
                        key_tree_node_selected = parseInt(node.key);
                    });
                    if (key_tree_node_selected != null) {
                        moduloService.getModulos(key_tree_node_selected).done(data => {
                            modulo_selected = data;
                            $('#btn_edit_modulo').prop('disabled', false)
                            $('#btn_add_modulo').prop('disabled', false)
                            $('#btn_delete_modulo').prop('disabled', false)
                        }).fail((error: any) => {
                            $('#btn_edit_modulo').prop('disabled', true)
                            $('#btn_add_modulo').prop('disabled', true)
                            $('#btn_delete_modulo').prop('disabled', true)
                        })
                    } else {
                        $('#btn_edit_modulo').prop('disabled', true)
                        $('#btn_add_modulo').prop('disabled', true)
                        $('#btn_delete_modulo').prop('disabled', true)
                    }
                },
                click: function (event: any, data: any) {
                    if (!data.node.folder) {
                        data.node.toggleSelected();
                    }
                },
                dblclick: function (event: any, data: any) {
                    data.node.toggleExpanded();
                },
                keydown: function (event: any, data: any) {
                    if (event.which === 32) {
                        data.node.toggleSelected();
                        return false;
                    }
                }
            }

            $('#tree_modulos').fancytree(options_tree);
            $('#tree_modulos').fancytree("destroy")
            $('#tree_modulos').fancytree(options_tree);
        })
    },
    addModulo: () => {
        if (form_modulo_validate.valid()) {
            let valid_form: IModulo = objectHelper.formToObject(utils.serializeForm('form_modulo'));
            valid_form.modulo_padre = modulo_selected.id;
            moduloService.addModulo(valid_form).done((response) => {
                utils.showSwalAlert('Se ha agregado el Modulo correctamente', 'Exito!', 'success');
                $('#modal_modulo_form').modal('hide');
                form_modulo_validate.resetForm();
                MenuAplicacionesController.getModuloRecursive();
            }).fail((error: any) => {
                utils.showSwalAlert('Ha ocurrido un error, por favor intente nuevamente', 'Error!', 'error');
            })
        }
    },
    updateModulo: () => {
        if (form_modulo_validate.valid()) {
            let valid_form: IModulo = objectHelper.formToObject(utils.serializeForm('form_modulo'));
            moduloService.updateModulo(modulo_selected.id, valid_form).done((response) => {
                utils.showSwalAlert('Se ha editado el Modulo correctamente', 'Exito!', 'success');
                $('#modal_modulo_form').modal('hide');
                form_modulo_validate.resetForm();
                MenuAplicacionesController.getModuloRecursive();
            }).fail((error: any) => {
                utils.showSwalAlert('Ha ocurrido un error, por favor intente nuevamente', 'Error!', 'error');
            })
        }
    },
    deleteModulo: () => {
        moduloService.deleteModulo(modulo_selected.id).done(() => {
            utils.showSwalAlert('El Modulo se ha eliminado exitosamente', 'Exito!', 'success');
            MenuAplicacionesController.getModuloRecursive();
        }).fail((error: any) => {
            utils.showSwalAlert('Ha ocurrido un error, por favor intente nuevamente', 'Error!', 'error');
        })
    }
}
var appMenuAplicaciones: any = {
    init: () => {
        MenuAplicacionesController.getProyectos();
        MenuAplicacionesController.getSistemas();
        form_modulo_validate = $('#form_modulo').validate(utils.validateForm(jsonRulesModuloForm));
    },
    setModal: (modal_title: string, modulo_selected_form: any) => {
        $('#modal_title_modulo_form').text(modal_title);
        if (modulo_selected_form != null) {
            for (let i in modulo_selected_form) {
                if ($(`[name=${i}]`).length) {
                    if (i == 'is_padre') {
                        modulo_selected_form.is_padre == 1 ? $('[name="is_padre"]').prop('checked', true) : $('[name="is_padre"]').prop('checked', false);
                    } else {
                        $(`[name=${i}]`).val(modulo_selected_form[i]);
                    }
                }
            }
        } else {
            form_modulo_validate.resetForm();
        }
    },

}

appMenuAplicaciones.init();

$('#btn_edit_modulo').on('click', () => {
    addModulo = false;
    updateModulo = true;
    appMenuAplicaciones.setModal('Editar Modulo', modulo_selected);
});

$('#btn_add_modulo').on('click', () => {
    addModulo = true;
    updateModulo = false;
    appMenuAplicaciones.setModal('Agregar Modulo', null);
    $('#form_modulo')[0].reset();
});

$('#btn_submit_form').on('click', () => {
    if (addModulo === true || updateModulo == false) {
        MenuAplicacionesController.addModulo();
    } else if (updateModulo === true || addModulo === false) {
        MenuAplicacionesController.updateModulo();
    }

});

$('#btn_delete_modulo').on('click', () => {
    // if(modulo_selected.modulo_hijos.length){
    //     utils.alert_confirm(MenuAplicacionesController.deleteModulo, 'Este modulo contiene mas hijos, aun asi lo desea borrar?');
    // }else{
    //     utils.alert_confirm(MenuAplicacionesController.deleteModulo, 'Esta usted seguro de eliminar este Modulo?');
    // }
    utils.alert_confirm(MenuAplicacionesController.deleteModulo, 'Esta usted seguro de eliminar este Modulo?');

});






