import Language from '../base/language';
import createLanguageDropDown from '../common_functions/attach_dom/language_dropdown';
import Cookies from '../../lib/js-cookie';

const checkClientsCountry = () => {
    BinarySocket.wait('website_status').then((response) => {
        if (response.error) return;
        const website_status = response.website_status;
        const clients_country = website_status.clients_country;
        if (clients_country === 'jp') {
            limitLanguage('JA');
        } else if (clients_country === 'id') {
            limitLanguage('ID');
        } else {
            createLanguageDropDown(website_status);
        }
    });
};

const limitLanguage = (lang) => {
    if (Language.get() !== lang) {
        window.location.href = Language.urlFor(lang); // need to redirect not using pjax
    }
    if (document.getElementById('select_language')) {
        $('.languages').remove();
        $('#gmt-clock').addClass('gr-6 gr-12-m').removeClass('gr-5 gr-6-m');
        $('#contact-us').addClass('gr-6').removeClass('gr-2');
    }
};

const jpClient = () => (typeof window === 'undefined' ? false : Language.get() === 'JA' || jpResidence());

const jpResidence = () => Cookies.get('residence') === 'jp';

const checkLanguage = () => {
    if (Language.get() === 'ID') {
        const $academy_link = $('.academy a');
        const academy_href = $academy_link.attr('href');
        const regex = /id/;
        if (!regex.test(academy_href)) {
            $academy_link.attr('href', academy_href + regex);
        }
    }
    if (jpClient()) {
        const visible = 'visibility: visible;';
        $('.ja-hide').addClass('invisible');
        $('.ja-show').attr('style', `display: inline !important; ${visible}`);
        $('.ja-show-block').attr('style', `display: block !important; ${visible}`);
        $('.ja-show-inline-block').attr('style', `display: inline-block !important; ${visible}`);
        $('.ja-no-padding').attr('style', 'padding-top: 0; padding-bottom: 0;');
        $('#regulatory-text').addClass('gr-12 gr-12-p').removeClass('gr-9 gr-7-p');
        if (!jpResidence()) {
            $('#topMenuCashier').hide();
        }
    }
};

module.exports = {
    checkClientsCountry: checkClientsCountry,
    jpClient           : jpClient,
    jpResidence        : jpResidence,
    checkLanguage      : checkLanguage,
};
