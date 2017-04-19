import IPHistoryData from './iphistory.data';
import IPHistoryUI from './iphistory.ui';

const IPHistoryInit = (() => {
    'use strict';

    const responseHandler = (response) => {
        if (response.error && response.error.message) {
            return IPHistoryUI.displayError(response.error.message);
        }
        const parsed = response.login_history.map(IPHistoryData.parse);
        return IPHistoryUI.update(parsed);
    };

    const init = () => {
        IPHistoryUI.init();
        const req = {
            login_history: '1',
            limit        : 50,
        };
        BinarySocket.send(req).then((response) => {
            responseHandler(response);
        });
    };

    const clean = () => {
        IPHistoryUI.clean();
    };

    return {
        init : init,
        clean: clean,
    };
})();

module.exports = IPHistoryInit;
