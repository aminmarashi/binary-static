const PortfolioInit = require('./account/portfolio/portfolio.init');
const updateContractBalance = require('../trade/update_values')
    .updateContractBalance;
const Client = require('../../base/client');
const formatMoney = require('../../common_functions/currency_to_symbol')
    .formatMoney;

const updateBalance = (response) => {
    if (response.hasOwnProperty('error')) {
        console.log(response.error.message);
        return;
    }
    const balance = response.balance.balance;
    Client.set('balance', balance);
    PortfolioInit.updateBalance();
    const currency = response.balance.currency;
    if (!currency) {
        return;
    }
    const view = formatMoney(currency, balance);
    updateContractBalance(balance);
    $('.topMenuBalance').text(view).css('visibility', 'visible');
};

module.exports = updateBalance;
