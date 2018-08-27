const tabListener  = require('@binary-com/binary-style').tabListener;
const ImageSlider  = require('../../_common/image_slider');
const MenuSelector = require('../../_common/menu_selector');
const Scroll       = require('../../_common/scroll');
const handleHash   = require('../../_common/utility').handleHash;
const BinaryPjax   = require('../../app/base/binary_pjax');
const Client       = require('../../app/base/client');
const Header       = require('../../app/base/header');

module.exports = {
    OpenPositions: {
        onLoad: () => { Scroll.scrollToHashSection(); },
    },
    Careers: {
        onLoad: () => { tabListener(); handleHash(); $('.has-tabs').tabs(); },
    },
    Locations: {
        onLoad  : () => { console.log('is location pages'); ImageSlider.init(); },
        onUnload: () => { ImageSlider.onUnMount(); },
    },
    OpenSourceProjects: {
        onLoad  : () => { Scroll.sidebarScroll($('.open-source-projects')); },
        onUnload: () => { Scroll.offScroll(); },
    },
    PaymentAgent: {
        onLoad  : () => { Scroll.sidebarScroll($('.payment-agent')); },
        onUnload: () => { Scroll.offScroll(); },
    },
    handleTab: {
        onLoad: () => { tabListener(); handleHash(); },
    },
    TypesOfAccounts: {
        onLoad: () => { Scroll.goToHashSection(); return false; },
    },
    LandingPage: {
        onLoad: () => {
            if (Client.hasAccountType('real')) {
                BinaryPjax.loadPreviousUrl();
            } else {
                Header.upgradeMessageVisibility();
            }
        },
    },
    AffiliatesFAQ: {
        onLoad  : () => { MenuSelector.init(['general', 'account-management-and-tracking', 'marketing-and-promotions', 'support']); },
        onUnload: () => { MenuSelector.clean(); },
    },
    IBProgrammeFAQ: {
        onLoad  : () => { MenuSelector.init(['general', 'account-management', 'marketing-and-promotions']); },
        onUnload: () => { MenuSelector.clean(); },
    },
};
