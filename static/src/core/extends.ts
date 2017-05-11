/**
 * Created by lfarfan on 19/02/2017.
 */
function getCookie(name: string): string {
    var cookieValue: string = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
//var csrftoken = getCookie('csrftoken');
var csrftoken = $('input[name="csrfmiddlewaretoken"]').val();


function csrfSafeMethod(method: string) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: (xhr, settings)=> {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            console.log(csrftoken);
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
