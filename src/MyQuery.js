import $ from 'jquery'
import Config from './Config'

const $$ = {
    ajax: (param) => {
        if (!param.xhrFields) {
            param.xhrFields = { withCredentials: true };
        }
        if (!param.crossDomain) {
            param.crossDomain = true;
        }
        $.ajax(param);
    }
}

export default $$;