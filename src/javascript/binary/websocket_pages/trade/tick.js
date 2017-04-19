import moment from 'moment';
import { countDecimalPlaces, displayPriceMovement } from './common_independent';
import { elementTextContent, isVisible } from '../../common_functions/common_functions';

/*
 * Tick object handles all the process/display related to tick streaming
 *
 * We request tick stream for particular underlying to update current spot
 *
 *
 * Usage:
 * use `Tick.detail` to populate this object
 *
 * then use
 *
 * `Tick.quote()` to get current spot quote
 * `Tick.id()` to get the unique for current stream
 * `Tick.epoch()` to get the tick epoch time
 * 'Tick.display()` to display current spot
 */
const Tick = (() => {
    'use strict';

    let quote = '',
        id = '',
        epoch = '',
        spots = {},
        error_message = '';

    const details = (data) => {
        error_message = '';

        if (data) {
            if (data.error) {
                error_message = data.error.message;
            } else {
                const tick = data.tick;
                quote = tick.quote;
                id = tick.id;
                epoch = tick.epoch;

                spots[epoch] = quote;
                const epoches = Object.keys(spots).sort((a, b) => a - b);
                if (epoches.length > 20) {
                    delete spots[epoches[0]];
                }
            }
        }
    };

    const display = () => {
        $('#spot').fadeIn(200);
        const spot_element = document.getElementById('spot');
        if (!spot_element) return;
        let message = '';
        if (error_message) {
            message = error_message;
        } else {
            message = quote;
        }

        if (parseFloat(message) !== +message) {
            spot_element.className = 'error';
        } else {
            spot_element.classList.remove('error');
            displayPriceMovement(spot_element, elementTextContent(spot_element), message);
            displayIndicativeBarrier();
        }

        elementTextContent(spot_element, message);
    };

    /*
     * display indicative barrier
     */
    const displayIndicativeBarrier = () => {
        const current_tick = Tick.quote();
        const unit = document.getElementById('duration_units');
        const indicative_barrier_tooltip = document.getElementById('indicative_barrier_tooltip');
        const indicative_high_barrier_tooltip = document.getElementById('indicative_high_barrier_tooltip');
        const indicative_low_barrier_tooltip = document.getElementById('indicative_low_barrier_tooltip');
        const barrier_element = document.getElementById('barrier');
        const high_barrier_element = document.getElementById('barrier_high');
        const low_barrier_element = document.getElementById('barrier_low');
        let value;

        const end_time = document.getElementById('expiry_date');
        if (
            unit &&
            (!isVisible(unit) || unit.value !== 'd') &&
            current_tick &&
            !isNaN(current_tick) &&
            (end_time &&
                (!isVisible(end_time) ||
                    moment(end_time.getAttribute('data-value')).isBefore(moment().add(1, 'day'), 'day')))
        ) {
            const decimal_places = countDecimalPlaces(current_tick);
            if (indicative_barrier_tooltip && isVisible(indicative_barrier_tooltip)) {
                const barrier_value = isNaN(parseFloat(barrier_element.value)) ? 0 : parseFloat(barrier_element.value);
                indicative_barrier_tooltip.textContent = (parseFloat(current_tick) + barrier_value).toFixed(
                    decimal_places,
                );
            }

            if (indicative_high_barrier_tooltip && isVisible(indicative_high_barrier_tooltip)) {
                value = parseFloat(high_barrier_element.value);
                value = isNaN(value) ? 0 : value;
                indicative_high_barrier_tooltip.textContent = (parseFloat(current_tick) + value).toFixed(
                    decimal_places,
                );
            }

            if (indicative_low_barrier_tooltip && isVisible(indicative_low_barrier_tooltip)) {
                value = parseFloat(low_barrier_element.value);
                value = isNaN(value) ? 0 : value;
                indicative_low_barrier_tooltip.textContent = (parseFloat(current_tick) + value).toFixed(decimal_places);
            }
        } else {
            elementTextContent(indicative_barrier_tooltip, '');
            elementTextContent(indicative_high_barrier_tooltip, '');
            elementTextContent(indicative_low_barrier_tooltip, '');
        }
    };

    const clean = () => {
        spots = {};
        quote = '';
        $('#spot').fadeOut(200, function() {
            // resets spot movement coloring, will continue on the next tick responses
            $(this).removeClass('price_moved_down price_moved_up').text('');
        });
    };

    return {
        details     : details,
        display     : display,
        clean       : clean,
        quote       : () => quote,
        id          : () => id,
        epoch       : () => epoch,
        errorMessage: () => error_message,
        spots       : () => spots,
        setQuote    : (q) => {
            quote = q;
        },
    };
})();

module.exports = Tick;
