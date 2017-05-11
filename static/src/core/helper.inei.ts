/**
 * Created by lfarfan on 19/02/2017.
 */
/**
 * Created by lfarfan on 29/01/2017.
 */

declare var MODULO_ID: any;
declare var BASEURL: string;

export class ObjectHelper {
    isEmpty(obj: Object): any {
        return Object.keys(obj).length === 0;
    }

    findInArrayObject(obj: any, value_search: any, key_search: string): any {
        let res = false;
        if (!this.isEmpty(obj)) {
            obj.map((value: any, key: any)=> {
                if (key_search in value) {
                    if (value[key_search] == value_search) {
                        res = value;
                    }
                }
            })
        }
        return res;
    }

    formToObject(form: Array<Object>) {
        let formObject: any = {};
        form.map((value: any, key: any)=> {
            formObject[value.name] = value.value;
        });
        return formObject;
    }

    findInArrayObjectRecursive(obj: any, value_search: any, key_search: string, key_where_recursive: string): any {
        let res: Array<any> = [];
        if (!this.isEmpty(obj)) {
            obj.map((value: any, key: any)=> {
                if (key_search in value) {
                    if (value[key_search] == value_search) {
                        debugger
                        res.push(value);
                        return false;
                    } else {
                        this.findInArrayObjectRecursive(value[key_where_recursive], value_search, key_search, key_where_recursive);
                    }
                }
            })
        }
        return res;

    }
}

export class MenuHelper {
    drawSidebar(menu: any) {
        let html = '';
        html += `<li class="navigation-header"><span>Censo de Poblacion y Vivienda VIII</span> <i class="icon-menu" title="Main pages"></i></li>`;
        html += this.recursiveHTMLSideBar(menu);
        return html;
    }

    recursiveHTMLSideBar(array: Array<Object>) {
        let html = '';
        array.map((value: any, key: any)=> {
            if (value.modulos_hijos.length) {
                html += `<li><a href="#"><i class="${value.icon}"></i> <span>${value.descripcion}</span></a><ul>`;
                value.modulos_hijos.map((child1: any, k: any)=> {
                    html += `<li ${child1.id == MODULO_ID ? 'class="active"' : ''}><a href="${BASEURL}/${child1.slug}">
                    <i class="${child1.icon}"></i>${child1.descripcion}</a></li>`;
                    html += this.recursiveHTMLSideBar(child1.modulos_hijos);
                })
                html += `</ul>`;
            } else {
                html += `<li ${value.id == MODULO_ID ? 'class="active"' : ''}><a href="${BASEURL}/${value.slug}">
                <i class="${value.icon}"></i> <span>${value.descripcion}</span></a></li>`;
            }
        });
        return html;
    }
}
export class SessionHelper {
    setSession(key: string, obj: Object) {
        key in localStorage ? localStorage.removeItem(key) : '';
        localStorage.setItem(key, JSON.stringify(obj));
        return this.getSession();
    }

    getSession(key = 'usuario') {
        return JSON.parse(localStorage.getItem(key));
    }
}