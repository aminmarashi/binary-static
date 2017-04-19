import 'select2';
import generateBirthDate from './attach_dom/birth_date_picker';
import BinaryPjax from '../base/binary_pjax';
import Client from '../base/client';
import { localize } from '../base/localize';
import { State } from '../base/storage';
import { makeOption } from '../common_functions/common_functions';
import FormManager from '../common_functions/form_manager';
import Cookies from '../../lib/js-cookie';

const AccountOpening = (() => {
    'use strict';

    const redirectCookie = () => {
        if (Client.get('has_real')) {
            BinaryPjax.load('trading');
            return true;
        }
        return false;
    };

    const redirectAccount = () => {
        BinarySocket.wait('landing_company').then((response) => {
            const is_virtual = Client.get('is_virtual');
            const landing_company = response.landing_company;

            // redirect client to correct account opening page if needed
            if (
                !State.get('is_financial_opening') &&
                ((!is_virtual && Client.canUpgradeGamingToFinancial(landing_company)) ||
                    Client.canUpgradeVirtualToFinancial(landing_company))
            ) {
                BinaryPjax.load('new_account/maltainvestws');
                return false;
            }
            if (!State.get('is_japan_opening') && is_virtual && Client.canUpgradeVirtualToJapan(landing_company)) {
                BinaryPjax.load('new_account/japanws');
                return false;
            }
            return true;
        });
    };

    const populateForm = (form_id, getValidations) => {
        getResidence();
        BinarySocket.send({ states_list: Client.get('residence') }).then(data =>
            handleState(data.states_list, form_id, getValidations),
        );
        generateBirthDate();
    };

    const getResidence = () => {
        BinarySocket.send({ residence_list: 1 }).then(response => handleResidenceList(response.residence_list));
    };

    const handleResidenceList = (residence_list) => {
        if (residence_list.length > 0) {
            const $place_of_birth = $('#place_of_birth');
            const $tax_residence = $('#tax_residence');
            const $phone = $('#phone');
            const residence_value = Client.get('residence') || '';
            let residence_text = '';

            const $options = $('<div/>');
            residence_list.forEach((res) => {
                $options.append(makeOption(res.text, res.value));

                if (residence_value === res.value) {
                    residence_text = res.text;
                    if (residence_value !== 'jp' && res.phone_idd && !$phone.val()) {
                        $phone.val(`+${res.phone_idd}`);
                    }
                }
            });

            $('#lbl_residence').html($('<strong/>', { text: residence_text }));
            $place_of_birth.html($options.html()).val(residence_value);
            if ($tax_residence) {
                $tax_residence.html($options.html()).promise().done(() => {
                    setTimeout(() => {
                        $tax_residence
                            .select2()
                            .val(getTaxResidence() || residence_value)
                            .trigger('change')
                            .removeClass('invisible');
                    }, 500);
                });
            }
        }
    };

    const getTaxResidence = () => {
        const tax_residence = State.get(['response', 'get_settings', 'get_settings'] || {}).tax_residence;
        return tax_residence ? tax_residence.split(',') : '';
    };

    const handleState = (states_list, form_id, getValidations) => {
        const address_state_id = '#address_state';
        BinarySocket.wait('get_settings').then((response) => {
            let $address_state = $(address_state_id);

            $address_state.empty();

            const client_state = response.get_settings.address_state;

            if (states_list && states_list.length > 0) {
                states_list.forEach((state) => {
                    $address_state.append(
                        $('<option/>', {
                            value: state.value,
                            text : state.text,
                        }),
                    );
                });
                if (client_state) {
                    $address_state.val(client_state);
                }
            } else {
                $address_state.replaceWith(
                    $('<input/>', {
                        id       : 'address_state',
                        name     : 'address_state',
                        type     : 'text',
                        maxlength: '35',
                    }),
                );
                $address_state = $(address_state_id);
                if (client_state) {
                    $address_state.text(client_state);
                }
            }
            $address_state.parent().parent().show();

            if (form_id && typeof getValidations === 'function') {
                FormManager.init(form_id, getValidations());
            }
        });
    };

    const handleNewAccount = (response, message_type) => {
        if (response.error) {
            const errorMessage = response.error.message;
            $('#submit-message').empty();
            $('#client_message')
                .find('.notice-msg')
                .text(
                    response.msg_type === 'sanity_check'
                        ? localize('There was some invalid character in an input field.')
                        : errorMessage,
                )
                .end()
                .removeClass('invisible');
        } else {
            Client.processNewAccount(
                Client.get('email'),
                response[message_type].client_id,
                response[message_type].oauth_token,
                false,
            );
        }
    };

    const commonValidations = () => {
        const req = [
            { selector: '#salutation', validations: ['req'] },
            {
                selector   : '#first_name',
                validations: ['req', 'letter_symbol', ['length', { min: 2, max: 30 }]],
            },
            {
                selector   : '#last_name',
                validations: ['req', 'letter_symbol', ['length', { min: 2, max: 30 }]],
            },
            { selector: '#date_of_birth', validations: ['req'] },
            {
                selector   : '#address_line_1',
                validations: ['req', 'address', ['length', { min: 1, max: 70 }]],
            },
            {
                selector   : '#address_line_2',
                validations: ['address', ['length', { min: 0, max: 70 }]],
            },
            {
                selector   : '#address_city',
                validations: ['req', 'letter_symbol', ['length', { min: 1, max: 35 }]],
            },
            {
                selector   : '#address_state',
                validations: $('#address_state').prop('nodeName') === 'SELECT'
                    ? ''
                    : ['general', ['length', { min: 0, max: 35 }]],
            },
            {
                selector   : '#address_postcode',
                validations: ['postcode', ['length', { min: 0, max: 20 }]],
            },
            {
                selector   : '#phone',
                validations: ['req', 'phone', ['length', { min: 6, max: 35 }]],
            },
            { selector: '#secret_question', validations: ['req'] },
            {
                selector   : '#secret_answer',
                validations: ['req', 'general', ['length', { min: 4, max: 50 }]],
            },
            {
                selector       : '#tnc',
                validations    : [['req', { message: 'Please accept the terms and conditions.' }]],
                exclude_request: 1,
            },

            { request_field: 'residence', value: Client.get('residence') },
        ];

        if (Cookies.get('affiliate_tracking')) {
            req.push({
                request_field: 'affiliate_token',
                value        : Cookies.getJSON('affiliate_tracking').t,
            });
        }

        return req;
    };

    const selectCheckboxValidation = (form_id) => {
        const validations = [];
        let validation,
            id;
        $(form_id).find('select, input[type=checkbox]').each(function() {
            id = $(this).attr('id');
            if (id !== 'tnc') {
                validation = { selector: `#${id}`, validations: ['req'] };
                if (id === 'not_pep') {
                    validation.exclude_request = 1;
                }
                validations.push(validation);
            }
        });
        return validations;
    };

    return {
        redirectAccount : redirectAccount,
        populateForm    : populateForm,
        redirectCookie  : redirectCookie,
        handleNewAccount: handleNewAccount,

        commonValidations       : commonValidations,
        selectCheckboxValidation: selectCheckboxValidation,
    };
})();

module.exports = AccountOpening;
