const Language = require('../../base/language');

const createLanguageDropDown = (website_status) => {
    const $languages = $('.languages');
    const select_language_id = '#select_language';
    const current_language = Language.get();

    $languages
        .find(`#display_language li, ${select_language_id} li`)
        .addClass(current_language)
        .find('span.language')
        .text(mapCodeToLanguage(current_language));

    const languages = website_status.supported_languages.sort(
        (a, b) => (a === 'EN' || a < b ? -1 : 1),
    );
    const $select_language = $languages.find(select_language_id);
    languages.forEach((language) => {
        $select_language.append(
            $('<li/>', { class: language, text: mapCodeToLanguage(language) }),
        );
    });

    $select_language.find(`.${current_language}:eq(1)`).addClass('invisible');
    Language.onChange();
    $languages.removeClass('invisible');
};

const mapCodeToLanguage = code => Language.getAll()[code];

module.exports = createLanguageDropDown;
