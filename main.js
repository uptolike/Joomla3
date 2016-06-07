/*140815 1.0.4*/
function regMe(my_mail) {
    str = jQuery.param({
        email: my_mail,
        partner: 'cms',
        projectId: 'cms' + document.location.host.replace(/\-/g, '').replace(new RegExp("^www.", "gim"), "").replace(/\./g, ''),
        url: document.location.host.replace(new RegExp("^www.", "gim"), "")
    });
    dataURL = "http://uptolike.com/api/getCryptKeyWithUserReg.json";
    jQuery.getJSON(dataURL + "?" + str + "&callback=?", {}, function (result) {
        var jsonString = JSON.stringify(result);
        var result = JSON.parse(jsonString);
        if ('ALREADY_EXISTS' == result.statusCode) {
            alert('Пользователь с таким email уже зарегистрирован, обратитесь в службу поддержки.');
        } else if ('MAIL_SENDED' == result.statusCode) {
            alert('Ключ отправлен вам на email. Теперь необходимо ввести его в поле ниже.');
            jQuery('#uptolike_email_field').css('background-color', 'lightgray');
            jQuery('#uptolike_email_field').prop('disabled', 'disabled');
            jQuery('#cryptkey_field').show();
            jQuery('#get_key_btn_field').hide();
            jQuery('#key_auth_field').show();
        } else if ('ILLEGAL_ARGUMENTS' == result.statusCode) {
            alert('Email указан неверно.')
        }
    });
}

//generate constructor url via js
function const_iframe(projectId, partnerId, mail, cryptKey) {
    params = {mail: mail, partner: partnerId, projectId: projectId};
    paramsStr = 'mail=' + mail + '&partner=' + partnerId + '&projectId=' + projectId + cryptKey;
    signature = CryptoJS.MD5(paramsStr).toString();
    params['signature'] = signature;
    if (((typeof(cryptKey) != 'undefined')) && (cryptKey.length > 0 )) {
        return 'http://uptolike.com/api/constructor.html';
    } else return 'http://uptolike.com/api/constructor.html';
}

var getCode = function () {
    var win = document.getElementById("cons_iframe").contentWindow;
    win.postMessage({action: 'getCode'}, "*");
};

function jgetCode(method) {
    window.jmethod = method;
    getCode();
}

function stat_iframe(projectId, partnerId, mail, cryptKey) {
    params = {mail: mail, partner: partnerId, projectId: projectId};
    paramsStr = 'mail=' + mail + '&partner=' + partnerId + '&projectId=' + projectId;
    signature = CryptoJS.MD5(paramsStr + cryptKey).toString();
    params['signature'] = signature;
    return 'http://uptolike.com/api/statistics.html?' + jQuery.param(params);
}

function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

jQuery(document).ready(function () {
    //copy values
    if (jQuery('#jform_params_uptolike_email')) {
        jQuery('#uptolike_email_field').val(jQuery('#jform_params_uptolike_email').val())
    }
    if (jQuery('#jform_params_id_number')) {
        jQuery('#uptolike_cryptkey').val(jQuery('#jform_params_id_number').val())
    }
    //add custom text to descr
    jQuery('div.info-labels').next().html('<img src="/plugins/content/uptolike/logo.png" style="float: left;margin: 10px;"></a><p>Uptolike это кастомизированные кнопки социальных сетей.<br>Кнопки соцсетей можно устанавливать в любом месте на странице, задавать цвет, форму, размер и спецэффекты. Не забывайте экспериментировать: кнопки соцсетей – один из конверсионных элементов на вашем сайте: добивайтесь самого удачного места их расположения и внешнего вида.<br>Uptolike собирает информацию о Like+Share; о том, сколько нового трафика из соцсетей привлекают Like+Share; сколько трафика из оцсетей приходится на весь сайт и на каждую страницу отдельно; об источниках трафика и так далее.</p><p>Данный плагин полностью бесплатен. Мы регулярно его улучшаем и добавляем новые функции.<br>Пожалуйста, оставьте свой отзыв на <a href="http://extensions.joomla.org/extensions/extension/social-web/social-share/uptolike-share-buttons">данной странице</a>. Спасибо!</p><p><b>Для начала работы с плагином Uptolike перейдите во вкладку Описание (Description).</b></p>');

    //disable input pos2
    if ((jQuery('#jform_params_uptolike_email').val() != '') && (jQuery('#uptolike_email_field').val() != '')) {

        //alert(( (jQuery('#jform_params_uptolike_email').val() != '') && (jQuery('.uptolike_email').val() != '')));
        jQuery('#uptolike_email_field').css('background-color', 'lightgray');
        jQuery('#uptolike_email_field').prop('disabled', 'disabled');
        jQuery('#get_key_btn_field').hide();
        jQuery('#after_key_req').show();
        jQuery('#before_key_req').hide();
        jQuery('#cryptkey_field').show();
        jQuery('#key_auth_field').show();
    }

    //user entered email, show tab for enter code
    if ((jQuery('#jform_params_uptolike_email').val() != '') && (jQuery('#uptolike_cryptkey').val() == '')) {
        document.location.hash = "stat";
    }

    //fix buttons in settings
    //jQuery('div#con_settings button').css('float', 'none!')

    //fixing system joomla styles (column width)
    jQuery('.readonly.plg-desc').css('width', '100%');

    //hiding widget code field
    jQuery('#jform_params_widget_code-lbl').parent().parent().hide();
    jQuery('#jform_params_widget_code').parent().parent().hide();
    jQuery('#jform_params_id_number').parent().parent().hide();
    jQuery('#jform_params_uptolike_email').parent().parent().hide();
    jQuery('#jform_params_uptolike_json').parent().parent().hide();
    jQuery('#jform_params_uptolike_partner').parent().parent().hide();
    jQuery('#jform_params_uptolike_project').parent().parent().hide();
    jQuery('#jform_params_id_number-lbl').parent().parent().hide();
    jQuery('#jform_params_uptolike_email-lbl').parent().parent().hide();
    jQuery('#jform_params_uptolike_json-lbl').parent().parent().hide();
    jQuery('#jform_params_uptolike_partner-lbl').parent().parent().hide();
    jQuery('#jform_params_uptolike_project-lbl').parent().parent().hide();
    jQuery('#toolbar button').each(function (i, data) {
        method = jQuery(data).attr('onclick');
        jQuery(data).attr('data-onclick', method);
        jQuery(data).attr('onclick', 'jgetCode("' + method + '")')
    });
    //joomla
    var onmessage = function (e) {
        if (window.debug == true) console.log(e);
        if ('ready' == e.data.action) {
            json = jQuery('input#jform_params_uptolike_json').val();
            initConstr(json);
        }
        if (('json' in e.data) && ('code' in e.data)) {
            jQuery('input#jform_params_uptolike_json').val(e.data.json);
            jQuery('input#jform_params_widget_code').val(e.data.code);
            if (window.debug == true) alert('got code from iframe');
            eval(window.jmethod);
        }
        jQuery('iframe#stats_iframe').hide();
        if (e.data.url.indexOf('statistics.html', 0) != -1) {
            switch (e.data.action) {
                case 'badCredentials':
                    if ((jQuery('#jform_params_uptolike_email').val() != '') && (jQuery('#uptolike_cryptkey').val() != '')) {
                        document.location.hash = "stat";
                        jQuery('#bad_key_field').show();
                    }
                    console.log('badCredentials');
                    break;
                case 'foreignAccess':
                    if ((jQuery('#jform_params_uptolike_email').val() != '') && (jQuery('#uptolike_cryptkey').val() != '')) {
                        document.location.hash = "stat";
                        jQuery('#foreignAccess_field').show();
                    }
                    console.log('foreignAccess');
                    break;
                case 'ready':
                    console.log('ready');
                    jQuery('iframe#stats_iframe').show();
                    break;
                case 'resize':
                    console.log('ready');
                    jQuery('iframe#stats_iframe').show();
                    jQuery('#key_auth_field').hide();
                    jQuery('#cryptkey_field').hide();
                    jQuery('#email_tr').hide();
                    jQuery('#after_key_req').hide();
                    break;
                default:
                    console.log(e.data.action);
            }
            if (e.data.action == 'badCredentials') {
                jQuery('#bad_key_field').show();
            }
        }
        if ((e.data.url.indexOf('constructor.html', 0) != -1) && (typeof e.data.size != 'undefined')) {
            if (e.data.size != 0) document.getElementById("cons_iframe").style.height = e.data.size + 'px';
        }
        if ((e.data.url.indexOf('statistics.html', 0) != -1) && (typeof e.data.size != 'undefined')) {
            if (e.data.size != 0)  document.getElementById("stats_iframe").style.height = e.data.size + 'px';
        }
    };
    if (typeof window.addEventListener != 'undefined') {
        window.addEventListener('message', onmessage, false);
    } else if (typeof window.attachEvent != 'undefined') {
        window.attachEvent('onmessage', onmessage);
    }
    function initConstr(jsonStr) {
        var win = document.getElementById("cons_iframe").contentWindow;
        if ('' !== jsonStr) {
            win.postMessage({action: 'initialize', json: jsonStr}, "*");
        }
    }
    function hashChange() {
        var hsh = document.location.hash;
        if (('#stat' == hsh) || ('#cons' == hsh)) {
            jQuery('.nav-tab-wrapper a').removeClass('nav-tab-active');
            jQuery('.wrapper-tab').removeClass('active');
            jQuery('#con_' + hsh.slice(1)).addClass('active');
            jQuery('a.nav-tab' + hsh).addClass('nav-tab-active');
        }
    }

    window.onhashchange = function () {
        hashChange();
    };

    //new reg button
    jQuery('button#get_key').click(function () {
        regMe(jQuery('#uptolike_email_field').val());
        jQuery('#jform_params_uptolike_email').val(jQuery('#uptolike_email_field').val());

        my_email = jQuery('#uptolike_email_field').val();
        jQuery('#jform_params_uptolike_email').attr('value', my_email);
        jQuery('[data-onclick="Joomla.submitbutton(\'plugin.apply\')"]').click();
    });
    //auth cryptkey
    jQuery('button#auth').click(function () {
        my_email = jQuery('#uptolike_email_field').val();
        my_key = jQuery('#uptolike_cryptkey').val();
        jQuery('#jform_params_id_number').attr('value', my_key);
        document.getElementById('jform_params_id_number').value = document.getElementById('jform_params_id_number').value.replace(/[ \t\r]+/g, "");
        jQuery('#jform_params_uptolike_email').attr('value', my_email);
        jQuery('[data-onclick="Joomla.submitbutton(\'plugin.apply\')"]').click();
    });

    /*
     //сохраняем мыло и код после получения ключа
     jQuery('.enter_block button').click(function () {
     my_email = jQuery('.enter_block input.uptolike_email').val();
     my_key = jQuery('.enter_block input.id_number').val();
     jQuery('#jform_params_id_number').attr('value', my_key);
     jQuery('#jform_params_uptolike_email').attr('value', my_email);
     jQuery('[data-onclick="Joomla.submitbutton(\'plugin.apply\')"]').click();
     })
     */
    //если юзер не зареган
    if (jQuery('.id_number').val() == '') {
        jQuery('#uptolike_email').after('<button type="button" onclick="regMe();">Зарегистрироваться</button>');
        json = jQuery('input#uptolike_json').val();
        initConstr(json);
    }
    jQuery('#widget_code').parent().parent().attr('style', 'display:none');
    jQuery('#uptolike_json').parent().parent().attr('style', 'display:none');
    jQuery('table.id_number').parent().parent().attr('style', 'display:none');
    jQuery('#uptolike_email').parent().parent().attr('style', 'display:none');

    jQuery('.nav-tab-wrapper a').click(function (e) {
        e.preventDefault();
        var click_id = jQuery(this).attr('id');
        document.location.hash = click_id;
        if (click_id != jQuery('.nav-tab-wrapper a.nav-tab-active').attr('id')) {
            jQuery('.nav-tab-wrapper a').removeClass('nav-tab-active');
            jQuery(this).addClass('nav-tab-active');
            jQuery('.wrapper-tab').removeClass('active');
            jQuery('#con_' + click_id).addClass('active');
        }
    });
    var host = window.location.hostname;
    hashChange();
    jQuery.getScript("http://uptolike.com/api/getsession.json")
        .done(function () {
            partnerId = 'cms';
            projectId = 'cms' + document.location.host.replace(/\-/g, '').replace(new RegExp("^www.", "gim"), "").replace(/\./g, '');
            email = document.getElementById('jform_params_uptolike_email').value;
            document.getElementById('jform_params_id_number').value = document.getElementById('jform_params_id_number').value.replace(/[ \t\r]+/g, "");
            cryptKey = document.getElementById('jform_params_id_number').value;
            //s.replace(/[ \t\r]+/g,"");
            jQuery('iframe#cons_iframe').attr('src', const_iframe(projectId, partnerId, email, cryptKey));
            //if we have cryptkey
            if (jQuery('#jform_params_id_number').val() !== '') {
                jQuery('iframe#stats_iframe').attr('src', stat_iframe(projectId, partnerId, email, cryptKey));
            }
        });

});
//}
//)
