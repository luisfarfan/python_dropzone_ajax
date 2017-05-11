/**
 * Created by Administrador on 21/02/2017.
 */

import RolesModel, {ModulosRolService} from './roles.service';
import {ProyectosService} from '../proyectos/proyectos.service';
import {MenuService} from '../menu/menu.service';
import {IProyecto} from '../proyectos/proyectos.interface';
import {ISistema} from '../sistemas/sistemas.interface';
import {IModuloRol} from './roles_permisos.interface';
import {PermisosService} from '../permisos/permisos.service';
import {IModulo} from '../menu/menu.interface';
import {ObjectHelper, SessionHelper} from '../../core/helper.inei';
import {IPermiso, IPermisos} from '../permisos/permisos.interface'
import * as util from '../../core/utils';

declare var $: any;
interface RolSelected {
    id: number;
    modulo_rol: Array<any>;
    nombre: string;
    descripcion: string;
    codigo: string,
    rol: number,
}

var objectHelper = new ObjectHelper();
var sessionHelper = new SessionHelper();
var rolesModel = new RolesModel();
var roles: Array<Object> = [];
var rol_selected: RolSelected = null;
var session = sessionHelper.getSession();
var tree_menu_format: Array<Object> = [];
var tree_menu_format_selecteds: Array<Object> = [];
var node_keys_selected: Array<number> = [];
var keys_modulos_by_rol: Array<number> = [];
var key_tree_node_selected: number = null;

var keys_modulos_deleted: Array<number> = [];
var keys_modulos_added_edited: Array<number> = [];


var RolJsonRules = {
    form_rol: {
        nombre: {
            maxlength: 30
        },
        descripcion: {
            maxlength: 30
        },
    }
}

var form_rol_validate = $('#form_rol').validate(util.validateForm(RolJsonRules.form_rol));

var utils: any = {
    enabledDisabledButtonModuloRol: () => {

    },
    diffDeletedAndEdited: () => {
        keys_modulos_deleted = keys_modulos_by_rol.filter(item => node_keys_selected.indexOf(item) < 0);
        keys_modulos_added_edited = node_keys_selected.filter(item => keys_modulos_deleted.indexOf(item) < 0);
    }
}


class ModuloRolController {
    private modulorolService = new ModulosRolService();
    private proyectosService = new ProyectosService();
    private menuService = new MenuService();
    private menu: IModulo[];
    private menuPermiso: IModulo[];
    private proyectos: IProyecto[] = null;
    private proyecto_selected: IProyecto = null;
    private sistema_selected: ISistema = null;
    private permisosService = new PermisosService();
    private permiso_selected: IPermiso;
    private permisos: IPermisos;
    private permisosModuloRol: IModuloRol;

    constructor() {
        this.getProyectos();
        this.setEvents();
    }

    setMenu() {
        this.menuService.get(this.proyecto_selected.id).done((menu: IModulo[]) => {
            this.menu = menu;
        });
    }

    setMenuPermiso() {
        this.menuService.getbyProyectoSistema(this.proyecto_selected.id, this.sistema_selected.id).done((menupermiso: IModulo[]) => {
            this.menuPermiso = menupermiso;
            this.drawMenuPermisos();
        });
    }

    editModulosRol(objectData: Object) {
        this.modulorolService.editModulosRol(objectData).done(() => {
            this.getRoles(null, rol_selected.id);
            util.showSwalAlert('Se ha editado con éxito!', 'Exito!', 'success');
        }).fail((error: any) => {
            console.log(error);
        });
    }

    getProyectos() {
        this.proyectosService.getSistemasProyecto().done((proyectos) => {
            this.proyectos = proyectos;
            util.setDropdown(this.proyectos, {id: 'id', text: ['nombre']}, {
                id_element: 'select_proyectos',
                bootstrap_multiselect: true,
                select2: false
            });
        });
    }

    setEvents() {
        $('#select_proyectos').on('change', (input: any) => {
            this.setProyecto(input.target.value);

            if (this.proyecto_selected !== null) {
                this.setMenu()
                util.setDropdown(this.proyecto_selected.sistemas, {id: 'id', text: ['nombre']}, {
                    id_element: 'select_sistemas',
                    bootstrap_multiselect: true,
                    select2: false
                });
            }
        });

        $('#select_sistemas').on('change', (input: any) => {
            this.setSistema(parseInt(input.target.value));
            if (this.sistema_selected !== null) {
                this.setMenuPermiso();
                this.getPermisos();
            }
        });
        $('#btn_edit_modulo_rol_permiso').click((event: JQueryEventObject) => {
            this.savePermisosModuloRol();
        });
    }

    setProyecto(id: any) {
        if (id == "-1") {
            this.proyecto_selected = null;
        } else {
            this.proyectos.filter(proyecto => proyecto.id == id ? this.proyecto_selected = proyecto : '');
        }
    }

    setSistema(id: any) {
        if (id == "-1") {
            this.sistema_selected = null;
        } else {
            this.proyecto_selected.sistemas.filter(sistema => sistema.id == id ? this.sistema_selected = sistema : '');
        }
    }

    getRoles(pk: number = null, rol_id_selected: number = null) {
        rolesModel.get().done((data) => {
            roles = data;
            this.drawRoles();
            rol_id_selected ? this.getRolSelected(rol_selected.id) : '';
        })
    }

    drawRoles() {
        let html = '';
        roles.map((value: any, key: any) => {
            html += `<tr>
                    <td>${parseInt(key) + 1}</td>
                    <td>${value.nombre}</td>
                    <td><ul class="icons-list">
                            <li name="li_rol" data-value=${value.id} class="text-primary-600"><a><i class="icon-pencil7"></i></a></li>
                            <li class="text-danger-600"><a><i class="icon-trash"></i></a></li>
						</ul></td>
                </tr>`;
        });
        $('#table_roles').find('tbody').html(html);
        $('li[name="li_rol"]').on('click', (event: any) => {
            this.getRolSelected($(event.currentTarget).data('value'));
        });
    }

    drawMenuPermisos() {
        if (rol_selected.modulo_rol.length) {
            rol_selected.modulo_rol.map((value, key) => {
                keys_modulos_by_rol.push(value.modulo.id);
            });
            tree_menu_format_selecteds = util.jsonFormatFancyTreeSelecteds(this.menuPermiso, keys_modulos_by_rol);
        }
        utils.enabledDisabledButtonModuloRol();

        const options_tree_selecteds = {
            checkbox: false,
            selectMode: 1,
            source: tree_menu_format_selecteds,
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
                    moduloRolController.getPermisosModuloRol(key_tree_node_selected);
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

        $('#tree_modulo_rol_permiso').fancytree(options_tree_selecteds);
        $('#tree_modulo_rol_permiso').fancytree("destroy");
        $('#tree_modulo_rol_permiso').fancytree(options_tree_selecteds);
    }

    getPermisosModuloRol(modulo_id: number) {
        $("[id^='permiso_id']").prop('checked', false);
        this.permisosService.getModuloRol(rol_selected.id, modulo_id).done((data: any) => {
            this.permisosModuloRol = data[0];
            if (this.permisosModuloRol !== undefined) {
                this.permisosModuloRol.permisos.map((value: IPermiso, pos: number) => {
                    $(`#permiso_id_${value.codigo}`).prop('checked', true);
                });
            }
        });
    }

    savePermisosModuloRol() {
        let permisos_checked: Array<number> = [];
        $("[id^='permiso_id']").map((index: number, element: HTMLInputElement) => {
            element.checked ? permisos_checked.push(parseInt(element.value)) : '';
        });
        if (this.permisosModuloRol != null) {
            this.permisosService.savePermisosModuloRol({
                modulo_id: this.permisosModuloRol.id,
                permiso: permisos_checked
            }).done(() => {
                util.showSwalAlert('Los permisos han sido agregados al Modulo', 'Exito!', 'success');
                this.getPermisosModuloRol(key_tree_node_selected);
            }).fail(() => {
                util.showSwalAlert('Ha ocurrido un error', 'Error', 'error');
            })
        }
    }

    getRolSelected(id: number) {
        if (this.proyecto_selected === null) {
            util.showInfo('Por favor Seleccione un proyecto!');
            return false;
        }
        rol_selected = objectHelper.findInArrayObject(roles, id, 'id');
        keys_modulos_by_rol = [];
        if (rol_selected.modulo_rol.length) {
            rol_selected.modulo_rol.map((value, key) => {
                keys_modulos_by_rol.push(value.modulo.id);
            });
            tree_menu_format = util.jsonFormatFancyTree(this.menu, keys_modulos_by_rol);
        } else {
            tree_menu_format = util.jsonFormatFancyTree(this.menu);
        }
        utils.enabledDisabledButtonModuloRol();

        let options_tree = {
            checkbox: true,
            selectMode: 3,
            source: tree_menu_format,
            init: function (event: any, data: any) {
                data.tree.getRootNode().visit(function (node: any) {
                    if (node.data.preselected) node.setSelected(true);
                });
            },
            loadChildren: function (event: any, ctx: any) {
                ctx.node.fixSelection3AfterClick();
            },
            select: function (event: any, data: any) {
                // Get a list of all selected nodes, and convert to a key array:
                let selKeys = $.map(data.tree.getSelectedNodes(), function (node: any) {
                    return parseInt(node.key);
                });
                // Get a list of all selected TOP nodes
                let selRootNodes = data.tree.getSelectedNodes(true);
                // ... and convert to a key array:
                let selRootKeys = $.map(selRootNodes, function (node: any) {
                    return node.key;
                });
                node_keys_selected = selKeys;
                //utils.enabledDisabledButtonModuloRol();
            },
            dblclick: function (event: any, data: any) {
                data.node.toggleSelected();
            },
            keydown: function (event: any, data: any) {
                if (event.which === 32) {
                    data.node.toggleSelected();
                    return false;
                }
            },
            // The following options are only required, if we have more than one tree on one page:
//				initId: "SOURCE",
            cookieId: "fancytree-Cb3",
            idPrefix: "fancytree-Cb3-"
        }

        $('#tree_menu_rol').fancytree(options_tree);
        $('#tree_menu_rol').fancytree("destroy");
        $('#tree_menu_rol').fancytree(options_tree);
    }

    addRol() {
        if (form_rol_validate.valid()) {
            let valid_form = objectHelper.formToObject(util.serializeForm('form_rol'));
            rolesModel.add(valid_form).done((response) => {
                util.showSwalAlert('Se ha agregado el Rol correctamente', 'Exito!', 'success');
                this.getRoles();
                form_rol_validate.resetForm();
                $('#modal_rol').modal('hide');
            }).fail((error: any) => {
                util.showSwalAlert('Ha ocurrido un error, por favor intente nuevamente', 'Error!', 'error');
            })
        }
    }

    getPermisos() {
        this.permisosService.getPermisosProyectoSistema(this.proyecto_selected.id, this.sistema_selected.id).done((permisos: IPermiso[]) => {
            this.permisos = permisos;
            this.drawPermisosCheckbox();
        })
    }

    drawPermisosCheckbox() {
        let html_genericos: string = '';
        let html_proyectosistema: string = '';
        this.permisos.map((value: IPermiso, pos: number) => {
            if (value.proyectosistema_id === null) {
                html_genericos += `<li class="list-group-item">
                                        ${value.nombre}
                                        <div class="material-switch pull-right">
                                            <input id="permiso_id_${value.codigo}" value="${value.id}" name="permiso_name_${value.codigo}"
                                                   type="checkbox"/>
                                            <label for="permiso_id_${value.codigo}" class="label-success"></label>
                                        </div>
                                    </li>`;
            } else {
                html_proyectosistema += `<li class="list-group-item">
                                            ${value.nombre}
                                            <div class="material-switch pull-right">
                                                <input id="permiso_id_${value.codigo}" value="${value.id}" name="permiso_name_${value.codigo}"
                                                       type="checkbox"/>
                                                <label for="permiso_id_${value.codigo}" class="label-success"></label>
                                            </div>
                                        </li>`;
            }
        });
        $('#ul_permisos_genericos').html(html_genericos);
        $('#ul_permisos_proyectosistema').html(html_proyectosistema);
    }
}

var moduloRolController = new ModuloRolController();
var id_dropdowns: Array<string> = ['select_proyectos', 'select_sistemas'];
var App: any = {
    init: () => {
        $('#btn_submit_form').on('click', (event: any) => {
            moduloRolController.addRol();
        });
        $('#btn_save_modulo_rol').on('click', (event: any) => {
            util.alert_confirm(() => {
                utils.diffDeletedAndEdited();
                moduloRolController.editModulosRol({
                    id_rol: rol_selected.id,
                    delete: keys_modulos_deleted,
                    edited: keys_modulos_added_edited
                })
            }, 'Esta seguro de guardar?', 'info')
        });
        id_dropdowns.map((value: string, pos: number) => {
            $(`#${value}`).selectpicker();
        });

        moduloRolController.getRoles();
        utils.enabledDisabledButtonModuloRol();

    }
}

App.init();