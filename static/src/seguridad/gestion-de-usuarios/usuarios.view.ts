/**
 * Created by Administrador on 6/03/2017.
 */
import {IUsuario} from './usuarios.interface';
import {UsuarioService} from './usuarios.service';
import RolesService from '../usuarios.roles/roles.service';
import {IRol} from '../usuarios.roles/roles_permisos.interface';
import * as utils from '../../core/utils';

declare var $: any;
class UsuarioController {
    private usuarios: IUsuario[];
    private usuario_selected: IUsuario = null;
    private rolesService = new RolesService();
    private roles: IRol[];
    private usuarioService = new UsuarioService();
    private datatable_users: any;
    private usuario_formRules: Object = {
        dni: {
            number: true
        },
        ape_pat: {
            maxlength: 50
        },
        ape_mat: {
            maxlength: 50
        },
        nombre: {
            maxlength: 100
        },
        fecha_contrato_inicio: {
            required: false,
            date: true,
        },
        fecha_contrato_fin: {
            required: false,
            date: true,
        },
        fecha_contrato_extended: {
            required: false,
            maxlength: 100,
            date: true,
        },
        email_inst: {
            required: false,
            maxlength: 100,
            email: true,
        },
        email_personal: {
            required: false,
            maxlength: 100,
            email: true,
        },
        usuario: {
            required: true,
            maxlength: 100
        },
        tipousuario: {
            required: true,
        },
        clave: {
            required: true,
            maxlength: 50
        }
    }
    private usuario_form: any;

    constructor() {
        this.usuario_form = $('#form_usuario').validate(utils.validateForm(this.usuario_formRules));
        this.datatable_users = $('#table_usuarios').DataTable();
        $('#table_usuarios tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                usuarioController.usuario_selected = null;
            }
            else {
                $('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                usuarioController.setUsuario($(this).data('value'));
            }
        });
        $('.dataTables_length select').select2({
            minimumResultsForSearch: Infinity,
            width: 'auto'
        });
        this.getUsuarios();
        this.getRoles();
        $('#btn_add_usuario').on('click', () => {
            this.setFormUsuario();
        });
        $("#btn_delete_usuario").on('click', () => {
            usuarioController.deleteUsuario();
        });
        $('#btn_submit_form').on('click', () => {
            this.saveUsuario();
        });
    }

    getRoles() {
        this.rolesService.get().done((roles: IRol[]) => {
            this.roles = roles;
            utils.setDropdown(this.roles, {id: 'id', text: ['nombre']}, {
                id_element: 'select_rol',
                bootstrap_multiselect: false,
                select2: true
            });
        }).fail()
    }

    getUsuarios() {
        this.usuarioService.get().done((usuarios: IUsuario[]) => {
            this.usuarios = usuarios;
            let html: string = '';
            this.usuarios.map((value: IUsuario, pos: number) => {
                html += `<tr data-value="${value.id}">
                            <td>${value.usuario}</td>
                            <td>${value.nombre} ${value.ape_pat} ${value.ape_mat}</td>
                            <td>${value.fecha_contrato_fin}</td>
                            <td>${value.email_inst}</td>
                            <td>DNI</td>
                            <td>${value.dni}</td>
                            <td>${value.activo === 1 ? '<span class="label label-success">Activo</span>' : '<span class="label label-danger">Inactivo</span>'}</td>
                            <td></td>
                         </tr>`;
            });
            if ($.fn.DataTable.isDataTable('#table_usuarios')) {
                this.datatable_users.destroy();
                $('#table_usuarios').find('tbody').html(html);
                this.datatable_users = $('#table_usuarios').DataTable();
                $('.dataTables_length select').select2({
                    minimumResultsForSearch: Infinity,
                    width: 'auto'
                });
            }
        }).fail(() => {
            utils.showInfo('ERROR AL CARGAR USUARIOS');
        })

    }

    setUsuario(id: number) {
        this.usuarios.filter((value: IUsuario) => value.id === id ? this.usuario_selected = value : '');
    }

    setFormUsuario() {
        let usuario_selected = <any>this.usuario_selected;
        if (this.usuario_selected !== null) {
            for (let key in usuario_selected) {
                let input = $(`[name="${key}"]`);
                if ($(`[name="${key}"]`).is(':checkbox')) {
                    usuario_selected[key] == 1 ? input.prop('checked', true) : '';
                } else {
                    if (key == 'tipousuario') {
                        input.val(usuario_selected.tipousuario.id);
                    } else if (key == 'rol') {
                        input.val(usuario_selected.rol.id).trigger('change');
                    } else {
                        input.val(usuario_selected[key]);
                    }
                }
            }
        } else {
            $('#form_usuario')[0].reset();
        }
    }

    saveUsuario() {
        this.usuario_form.form()
        if (this.usuario_form.valid()) {
            let data_form: IUsuario = utils.formToObject(utils.serializeForm('form_usuario'));
            if (this.usuario_selected === null) {
                this.usuarioService.add(data_form).done((response: IUsuario) => {
                    utils.showSwalAlert('Se agrego el usuario correctamente!', 'Exito!', 'success');
                    this.getUsuarios();
                    $('#modal_usuario').modal('hide');
                }).fail(() => {
                    utils.showSwalAlert('Error!', 'Exito!', 'error');
                })
            } else {
                this.usuarioService.update(this.usuario_selected.id, data_form).done((response: IUsuario) => {
                    utils.showSwalAlert('Se edito el usuario correctamente!', 'Exito!', 'success');
                    this.getUsuarios();
                    $('#modal_usuario').modal('hide');
                }).fail(() => {
                    utils.showSwalAlert('Error!', 'Exito!', 'error');
                });
            }
        }
    }

    deleteUsuario() {
        if (this.usuario_selected !== null) {
            this.usuarioService.delete(this.usuario_selected.id).done(() => {
                utils.showSwalAlert('Se elimino el usuario correctamente!', 'Exito!', 'success');
                this.getUsuarios();
            }).fail(() => {
                utils.showSwalAlert('Error!', 'Exito!', 'error');
            })
        } else {
            utils.showInfo('Usted debe seleccionar algun usuario');
        }
    }
}

let usuarioController = new UsuarioController();