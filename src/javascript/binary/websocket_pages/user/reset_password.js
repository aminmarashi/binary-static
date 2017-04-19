const localize = require('../../base/localize').localize;
const Login = require('../../base/login');
const generateBirthDate = require('../../common_functions/attach_dom/birth_date_picker');
const FormManager = require('../../common_functions/form_manager');

const ResetPassword = (() => {
    'use strict';

    const hidden_class = 'invisible';

    const responseHandler = (response) => {
        $('#container_reset_password').addClass(hidden_class);
        if (response.error) {
            const $form_error = $('#form_error');
            const reset_error_template =
                '[_1] Please click the link below to restart the password recovery process. If you require further assistance, please contact our Customer Support.';
            const error_code = response.error.code;

            $('#msg_reset_password').addClass(hidden_class);

            let err_msg;
            if (error_code === 'SocialBased') {
                err_msg = localize(response.error.message);
                $form_error.find('a').addClass(hidden_class);
            } else {
                // special handling as backend return inconsistent format
                err_msg = localize(reset_error_template, [
                    error_code === 'InputValidationFailed'
                        ? localize(
                              'There was some invalid character in an input field.',
                          )
                        : localize(response.error.message),
                ]);
            }

            $('#form_error_msg').text(err_msg);
            $form_error.removeClass(hidden_class);
        } else {
            $('#msg_reset_password').text(
                localize(
                    'Your password has been successfully reset. Please log into your account using your new password.',
                ),
            );
            setTimeout(() => {
                Login.redirectToLogin();
            }, 5000);
        }
    };

    const onLoad = () => {
        generateBirthDate();

        $('#have_real_account').off('click').on('click', function() {
            if ($(this).is(':checked')) {
                $('#dob_field').removeClass(hidden_class);
            } else {
                $('#dob_field').addClass(hidden_class);
            }
        });

        const form_id = '#frm_reset_password';
        FormManager.init(form_id, [
            {
                selector   : '#verification_code',
                validations: ['req', 'email_token'],
            },
            {
                selector      : '#new_password',
                validations   : ['req', 'password'],
                re_check_field: '#repeat_password',
            },
            {
                selector       : '#repeat_password',
                validations    : ['req', ['compare', { to: '#new_password' }]],
                exclude_request: 1,
            },
            { selector: '#date_of_birth', validations: ['req'] },

            { request_field: 'reset_password', value: 1 },
        ]);

        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: responseHandler,
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = ResetPassword;
