define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    /**
     * Created by lfarfan on 29/01/2017.
     */

    class ObjectHelper {
        isEmpty(obj) {
            return Object.keys(obj).length === 0;
        }

        findInArrayObject(obj, value_search, key_search) {
            let res = false;
            if (!this.isEmpty(obj)) {
                obj.map((value, key) => {
                    if (key_search in value) {
                        if (value[key_search] == value_search) {
                            res = value;
                        }
                    }
                });
            }
            return res;
        }

        formToObject(form = []) {
            let formObject = {};
            form.map((value, key) => {
                formObject[value.name] = value.value;
            });
            return formObject;
        }
    }

    exports.ObjectHelper = ObjectHelper;
    class MenuHelper {
        drawSidebar(menu) {
            let html = '';
            html += `<li class="navigation-header"><span>Censo de Poblacion y Vivienda VIII</span> <i class="icon-menu" title="Main pages"></i></li>`;
            html += this.recursiveHTMLSideBar(menu);
            console.log(html);
            return html;
        }

        recursiveHTMLSideBar(array) {
            let html = '';
            array.map((value, key) => {
                if (value.modulos_hijos.length) {
                    html += `<li><a href="#"><i class="${value.icon}"></i> <span>${value.descripcion}</span></a><ul>`;
                    value.modulos_hijos.map((child1, k) => {
                        html += `<li ${child1.id == MODULO_ID ? 'class="active"' : ''}><a href="${BASEURL}/${child1.slug}"><i class="${child1.icon}"></i>${child1.descripcion}</a></li>`;
                        html += this.recursiveHTMLSideBar(child1.modulos_hijos);
                    });
                    html += `</ul>`;
                } else {
                    html += `<li ${value.id == MODULO_ID ? 'class="active"' : ''}><a href="${BASEURL}/${value.slug}"><i class="${value.icon}"></i> <span>${value.descripcion}</span></a></li>`;
                }
            });
            return html;
        }
    }
    exports.MenuHelper = MenuHelper;
    class SessionHelper {
        setSession(key, object) {
            key in localStorage ? localStorage.removeItem(key) : '';
            localStorage.setItem(key, JSON.stringify(object));
            return this.getSession();
        }

        getSession(key = 'usuario') {
            return JSON.parse(localStorage.getItem(key));
        }
    }
    exports.SessionHelper = SessionHelper;
});