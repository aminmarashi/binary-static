import Client from '../../base/client';
import { State } from '../../base/storage';

/*
 * get the current active tab if its visible i.e allowed for current parameters
 */
const getActiveTab = (item) => {
    const tab = item || 'currentAnalysisTab';
    let selected_tab =
        sessionStorage.getItem(tab) ||
        (State.get('is_mb_trading') ? 'tab_portfolio' : window.chartAllowed ? 'tab_graph' : 'tab_explanation');
    const selected_element = document.getElementById(selected_tab);

    if (
        selected_element &&
        selected_element.classList.contains('invisible') &&
        (item || !(selected_tab === 'tab_portfolio' && !!(Client.isLoggedIn() && State.get('is_mb_trading'))))
    ) {
        selected_tab = window.chartAllowed ? 'tab_graph' : 'tab_explanation';
        sessionStorage.setItem(tab, selected_tab);
    }

    return selected_tab;
};

module.exports = {
    getActiveTab     : getActiveTab,
    getActiveTab_Beta: () => getActiveTab('currentAnalysisTab_Beta'),
};
