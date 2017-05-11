/**
 * Created by lfarfan on 26/02/2017.
 */
import {IPermiso} from 'permisos.interface';
import {IProyecto} from '../proyectos/proyectos.interface';
import {ISistema} from '../sistemas/sistemas.interface';
import {PermisosService} from 'permisos.service';
import {ProyectosService} from '../proyectos/proyectos.service';
import * as utils from '../../core/utils';
import {ObjectHelper} from '../../core/helper.inei';
declare var $: any;
var objectHelper = new ObjectHelper();

class PermisoController {
    private permisos: IPermiso[];
    private permiso_selected: IPermiso;
    private permisos_proyectosistema: IPermiso[];
    private proyectosistema: any = null;
    private permisos_proyectosistema_selected: IPermiso;
    private permisoService = new PermisosService();
    private proyectosService = new ProyectosService();
    private proyectos: IProyecto[];
    private proyecto_selected: IProyecto;
    private sistema_selected: ISistema;
    private permiso_json_rules = {
        nombre: {
            maxlength: 30
        },
        descripcion: {
            maxlength: 50
        },
        codigo: {
            number: true
        },
        dom_sufijo_name: {
            maxlength: 15
        }
    }
    private permiso_form_validate: any;

    constructor() {
        this.onInit();
    }

    onInit() {
        this.getPermisos();
        this.permiso_form_validate = $('#form_permiso').validate(utils.validateForm(this.permiso_json_rules));
        this.getProyectos();

        $('#btn_add_permiso').on('click', () => {
            this.setModal('Agregar Permiso', null);
            $('#modal_permiso').modal('show');
        });
        $('#btn_add_permiso_proyecto_sistema').on('click', () => {
            this.setModal('Agregar Permiso', null);
            $('#modal_permiso').modal('show');
        });
        $('#btn_save_permiso').on('click', () => {
            if (this.permiso_selected === null) {
                $('#tab_permisos_genericos').hasClass('active') ? this.addPermiso() : this.addPermiso(true);
            } else {
                this.editPermiso();
            }
        });
        this.setChangeProyectos();
        this.setChangeSistemas();
    }

    getPermisos() {
        this.permisoService.getGenericos().done((data: any) => {
            this.permisos = data;
            utils.drawTable(this.permisos, ['codigo', 'nombre', 'descripcion', 'dom_name_sufijo'], 'id', {
                edit_name: 'btn_edit_permiso',
                delete_name: 'btn_delete_permiso',
                enumerar: true,
                table_id: 'table_permisos'
            });
            this.upgradeHTMLElements();

        }).fail(() => {
            utils.showSwalAlert('Ha ocurrido un error', 'Error', 'error');
        })
    }

    upgradeHTMLElements() {
        $('li[name="btn_edit_permiso"]').on('click', (event: any) => {
            $('#tab_permisos_genericos').hasClass('active') ? this.setPermiso($(event.currentTarget).data('value')) : this.setPermiso($(event.currentTarget).data('value'), true);
            $('#tab_permisos_genericos').hasClass('active') ? this.setModal('Editar Permiso', this.permiso_selected) : this.setModal('Editar Permiso', this.permiso_selected);
            $('#modal_permiso').modal('show');
        });

        $('li[name="btn_delete_permiso"]').on('click', (event: any) => {
            this.setPermiso(parseInt($(event.currentTarget).data('value')))
            utils.alert_confirm(() => this.deletePermiso(parseInt($(event.currentTarget).data('value'))), 'Esta seguro que desea eliminar?', 'error');
        });
    }

    setChangeProyectos() {
        $('#select_proyectos').on('change', (event: any) => {
            this.setProyecto(event.target.value);
            let _html: string = '';
            _html += `<option value="-1">Seleccione</option>`;
            this.proyecto_selected.sistemas.map((value: ISistema, key: number) => {
                _html += `<option value="${value.id}">${value.nombre}</option>`;
            })
            $('#select_sistemas').html(_html);
            $('.bootstrap-select').selectpicker('destroy');
            $('.bootstrap-select').selectpicker('render');
        });
    }

    setChangeSistemas() {
        $('#select_sistemas').on('change', (event: any) => {
            this.setSistema(event.target.value);
            this.proyectosService.getProyectoSistema(this.proyecto_selected.id, this.sistema_selected.id).done(response => {
                this.proyectosistema = response[0];
            });
            this.getPermisosbyProyectoSistema();
        })
    }

    getPermisosbyProyectoSistema() {
        this.permisoService.getPermisosbyProyectoSistema(this.proyecto_selected.id, this.sistema_selected.id).done(data => {
            this.permisos_proyectosistema = data;
            let message_html: string = '';
            if (this.permisos_proyectosistema.length) {
                $('#message_empty_permisos').html('');
                utils.drawTable(this.permisos_proyectosistema, ['codigo', 'nombre', 'descripcion', 'dom_name_sufijo'], 'id', {
                    edit_name: 'btn_edit_permiso',
                    delete_name: 'btn_delete_permiso',
                    enumerar: true,
                    table_id: 'table_permisos_proyecto_sistema'
                });
                this.upgradeHTMLElements();
            } else {
                message_html = utils.showDivAlert('No hay permisos creandos aún, haga click en el boton + para agregar permisos', 'info');
                $('#message_empty_permisos').html(message_html);
                $('#table_permisos_proyecto_sistema').find('tbody').html('');
            }
        }).fail((error: Error) => {
            console.log(error);
        })
    }

    getProyectos() {
        this.proyectosService.getSistemasProyecto().done(data => {
            this.proyectos = data;
            let html: string = '';
            html += `<option value="-1">Seleccione</option>`;
            this.proyectos.map((value: IProyecto, key: number) => {
                html += `<option value="${value.id}">${value.nombre}</option>`;
            });
            $('#select_proyectos').html(html);
            $('.bootstrap-select').selectpicker();
        });
    }

    addPermiso(proyectosistema: boolean = false) {
        if (this.permiso_form_validate.valid()) {
            let valid_form: any = objectHelper.formToObject(utils.serializeForm('form_permiso'));
            // if (this.proyecto_selected !== null && this.sistema_selected !== null) {
            //     valid_form['proyectosistema'] = this.proyectosistema.id;
            // }
            proyectosistema ? valid_form['proyectosistema'] = this.proyectosistema.id : '';
            this.permisoService.add(valid_form).done(() => {
                this.permiso_form_validate.resetForm();
                proyectosistema ? this.getPermisosbyProyectoSistema() : this.getPermisos();
                $('#modal_permiso').modal('hide');
                utils.showSwalAlert('El permiso se ha agregado con éxito!', 'Exito!', 'success');
            }).fail(() => {
                utils.showSwalAlert('Ha ocurrido un error!, favor de contactar con el administrador', 'Error', 'error');
                $('#modal_permiso').modal('hide');
            })
        }
    }

    editPermiso(proyectosistema: boolean = false) {
        if (this.permiso_form_validate.valid()) {
            let valid_form = objectHelper.formToObject(utils.serializeForm('form_permiso'));
            this.permisoService.update(this.permiso_selected.id, valid_form).done(() => {
                this.permiso_form_validate.resetForm();
                proyectosistema ? this.getPermisosbyProyectoSistema() : this.getPermisos();
                $('#modal_permiso').modal('hide');
                utils.showSwalAlert('El permiso se ha editado con exito!', 'Exito!', 'success');
            }).fail(() => {
                utils.showSwalAlert('Ha ocurrido un error!, favor de contactar con el administrador', 'Error', 'error');
                $('#modal_permiso').modal('hide');
            });

        }
    }

    deletePermiso(pk: number) {
        this.permisoService.delete(pk).done(() => {
            this.getPermisosbyProyectoSistema();
            this.getPermisos();
            utils.showSwalAlert('El permiso se ha borrado con éxito', 'Eliminado', 'success');
        }).fail(() => utils.showSwalAlert('Ha ocurrido un error!, favor de contactar con el administrador', 'Error', 'error'))
    }

    setPermiso(pk: number, proyectosistema: boolean = false) {
        let data: any = null;
        if (proyectosistema) {
            this.permisos_proyectosistema.filter((value) => {
                if (value.id == pk) {
                    data = value;
                }
            });
            this.permisos_proyectosistema_selected = data;
        }
        this.permisos.filter((value) => {
            if (value.id == pk) {
                data = value;
            }
        });
        this.permiso_selected = data;
    }

    setProyecto(pk: number) {
        let data: any = null;
        this.proyectos.filter((value) => {
            if (value.id == pk) {
                data = value;
            }
        })
        this.proyecto_selected = data;
    }

    setSistema(pk: number) {
        let data: any = null;
        this.proyecto_selected.sistemas.filter((value) => {
            if (value.id == pk) {
                data = value;
            }
        });
        this.sistema_selected = data;
    }

    setModal(modal_title: string, data_selected: any = null) {
        this.permiso_selected = data_selected;
        $('#modal_title_modulo_form').text(modal_title);
        if (data_selected != null) {
            for (let i in data_selected) {
                if ($(`[name=${i}]`).length) {
                    $(`[name=${i}]`).val(data_selected[i]);
                }
            }
        } else {
            $('#form_permiso')[0].reset();
            this.permiso_form_validate.resetForm();
        }
    }
}

new PermisoController();