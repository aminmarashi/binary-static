const Client = require('../../binary/base/client');
const State = require('../../binary/base/storage').State;
const PortfolioInit = require('../../binary/websocket_pages/user/account/portfolio/portfolio.init');

const JapanPortfolio = (() => {
    let $portfolio,
        is_portfolio_active = false;

    const init = () => {
        if (isActive()) {
            $('#tab_portfolio').removeClass('invisible');
        }

        const $container = $('#tab_portfolio-content');
        $portfolio = $portfolio || $('#portfolio');

        if ($portfolio && (!$portfolio.parent().length || $portfolio.parent().get(0).id !== 'tab_portfolio-content')) {
            $portfolio.detach();
            $container.append($portfolio);
        }
    };

    const show = () => {
        if (isTradePage() && !is_portfolio_active) {
            PortfolioInit.onLoad();
            is_portfolio_active = true;
        }
    };

    const isActive = () => !!(Client.isLoggedIn() && isTradePage());

    const hide = () => {
        if (isTradePage() && is_portfolio_active) {
            PortfolioInit.onUnload();
            is_portfolio_active = false;
            $portfolio = undefined;
        }
    };

    const isTradePage = () => State.get('is_mb_trading');

    return {
        init    : init,
        show    : show,
        hide    : hide,
        isActive: isActive,
    };
})();

module.exports = JapanPortfolio;
