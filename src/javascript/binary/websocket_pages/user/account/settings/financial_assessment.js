import BinaryPjax from '../../../../base/binary_pjax';
import Header from '../../../../base/header';
import { localize } from '../../../../base/localize';
import { State } from '../../../../base/storage';
import { isEmptyObject, showLoadingImage } from '../../../../base/utility';
import { jpClient } from '../../../../common_functions/country_base';
import Validation from '../../../../common_functions/form_validation';

const FinancialAssessment = (() => {
    'use strict';

    let financial_assessment = {},
        arr_validation = [];

    const form_selector = '#frm_assessment';
    const hidden_class = 'invisible';

    const onLoad = () => {
        if (jpClient()) {
            BinaryPjax.load('user/settingsws');
        }

        $(form_selector).on('submit', (event) => {
            event.preventDefault();
            submitForm();
        });

        BinarySocket.wait('get_financial_assessment').then((response) => {
            handleForm(response);
        });
    };

    const handleForm = (response) => {
        if (!response) {
            response = State.get(['response', 'get_financial_assessment']);
        }
        hideLoadingImg(true);

        financial_assessment = $.extend({}, response.get_financial_assessment);

        if (isEmptyObject(financial_assessment)) {
            BinarySocket.wait('get_account_status').then((data) => {
                if (data.get_account_status.risk_classification === 'high') {
                    $('#high_risk_classification').removeClass('invisible');
                }
            });
        }

        Object.keys(financial_assessment).forEach((key) => {
            const val = financial_assessment[key];
            $(`#${key}`).val(val);
        });

        arr_validation = [];
        if (financial_assessment.occupation === undefined) {
            // handle existing assessments
            financial_assessment.occupation = '';
        }
        $(form_selector).find('select').map(function() {
            arr_validation.push({
                selector   : `#${$(this).attr('id')}`,
                validations: ['req'],
            });
        });
        Validation.init(form_selector, arr_validation);
    };

    const submitForm = () => {
        const $btn_submit = $(`${form_selector} #btn_submit`);
        $btn_submit.attr('disabled', 'disabled');

        if (Validation.validate(form_selector)) {
            let has_changed = false;
            Object.keys(financial_assessment).forEach((key) => {
                const $key = $(`#${key}`);
                if ($key.length && $key.val() !== financial_assessment[key]) {
                    has_changed = true;
                }
            });
            if (Object.keys(financial_assessment).length === 0) {
                has_changed = true;
            }
            if (!has_changed) {
                showFormMessage('You did not change anything.', false);
                setTimeout(() => {
                    $btn_submit.removeAttr('disabled');
                }, 1000);
                return;
            }

            const data = { set_financial_assessment: 1 };
            showLoadingImage($('#msg_form'));
            $(form_selector).find('select').each(function() {
                financial_assessment[$(this).attr('id')] = data[$(this).attr('id')] = $(this).val();
            });
            BinarySocket.send(data).then((response) => {
                $btn_submit.removeAttr('disabled');
                if (response.error) {
                    showFormMessage('Sorry, an error occurred while processing your request.', false);
                } else {
                    showFormMessage('Your changes have been updated successfully.', true);
                    BinarySocket.send({
                        get_financial_assessment: 1,
                    }).then(() => {
                        Header.displayAccountStatus();
                    });
                }
            });
        } else {
            setTimeout(() => {
                $btn_submit.removeAttr('disabled');
            }, 1000);
        }
    };

    const hideLoadingImg = (show_form) => {
        $('#assessment_loading').remove();
        if (show_form) {
            $(form_selector).removeClass(hidden_class);
        }
    };

    const showFormMessage = (msg, is_success) => {
        const redirect_url = localStorage.getItem('financial_assessment_redirect');
        if (is_success && /metatrader/i.test(redirect_url)) {
            localStorage.removeItem('financial_assessment_redirect');
            $.scrollTo($('h1#heading'), 500, { offset: -10 });
            $(form_selector).addClass(hidden_class);
            $('#msg_main').removeClass(hidden_class);
            BinarySocket.send({
                get_account_status: 1,
            }).then((response_status) => {
                if ($.inArray('authenticated', response_status.get_account_status.status) === -1) {
                    $('#msg_authenticate').removeClass(hidden_class);
                }
            });
        } else {
            $('#msg_form')
                .attr('class', is_success ? 'success-msg' : 'errorfield')
                .html(
                    is_success
                        ? $('<ul/>', {
                            class: 'checked',
                            style: 'display: inline-block;',
                        }).append($('<li/>', { text: localize(msg) }))
                        : localize(msg),
                )
                .css('display', 'block')
                .delay(5000)
                .fadeOut(1000);
        }
    };

    return {
        onLoad    : onLoad,
        handleForm: handleForm,
        submitForm: submitForm,
    };
})();

module.exports = FinancialAssessment;
