import Client from '../base/client';
import BinaryPjax from '../base/binary_pjax';
import { jpClient } from '../common_functions/country_base';

const GetStartedJP = (() => {
    'use strict';

    let $contents,
        $sidebar_left_li,
        $index;

    const showSelectedTab = () => {
        const updated_tab = window.location.hash;
        $contents.find('div').hide();
        $sidebar_left_li.removeClass('selected');
        if (updated_tab) {
            $index.hide();
            $contents.find(`div[id=content-${updated_tab.slice(1, updated_tab.length)}]`).show().find('div').show();
            $sidebar_left_li.filter(`.${updated_tab.slice(1, updated_tab.length)}`).addClass('selected');
            $contents.show();
        } else {
            $contents.hide();
            $index.show();
        }
    };

    const onLoad = () => {
        if (!jpClient()) {
            BinaryPjax.load('get-started');
        }

        Client.activateByClientType();
        $contents = $('.contents');
        $sidebar_left_li = $('.sidebar-left ul li');
        $index = $('#index');

        const tab = window.location.hash;
        if (tab && tab !== '') {
            $index.hide();
            $(`.sidebar-left ul li.${tab.slice(1, tab.length)}`).addClass('selected');
            showSelectedTab();
        }

        $(window).on('hashchange', () => {
            showSelectedTab();
        });

        $sidebar_left_li.click(function() {
            $('.sidebar-left ul li').removeClass('selected');
            $(this).addClass('selected');
        });
    };

    const onUnload = () => {
        $(window).off('hashchange');
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = GetStartedJP;
