import ActiveSymbols from '../../common_functions/active_symbols';

/*
 * MBSymbols object parses the active_symbols json that we get from socket.send({active_symbols: 'brief'}
 * and outputs in usable form, it gives markets, underlyings
 *
 *
 * Usage:
 *
 * use `MBSymbols.details` to populate this object first
 *
 * then use
 *
 * `MBSymbols.markets` to get markets like Forex
 * `MBSymbols.underlyings` to get underlyings
 *
 */

const MBSymbols = (() => {
    'use strict';

    let trade_markets = {},
        trade_markets_list = {},
        trade_underlyings = {},
        all_symbols = {},
        names = {};

    const details = (data) => {
        ActiveSymbols.clearData();
        const active_symbols = data.active_symbols;
        trade_markets = ActiveSymbols.getMarkets(active_symbols);
        trade_markets_list = ActiveSymbols.getMarketsList(active_symbols);
        trade_underlyings = ActiveSymbols.getTradeUnderlyings(active_symbols);
        all_symbols = ActiveSymbols.getSymbols(all_symbols);
        names = ActiveSymbols.getSymbolNames(active_symbols);
    };

    return {
        details      : details,
        markets      : list => (list ? trade_markets_list : trade_markets),
        underlyings  : () => trade_underlyings,
        getName      : symbol => names[symbol],
        getAllSymbols: () => all_symbols,
        clearData    : () => {
            ActiveSymbols.clearData();
        },
    };
})();

module.exports = MBSymbols;
