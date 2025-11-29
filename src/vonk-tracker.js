import { Event } from './event.js';

(function () {
    function trackButtons() {
        const buttons = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');

        buttons.forEach(button => {
            button.addEventListener('click', function (event) {
                const eventData = new Event('button_click', event.currentTarget);
                eventData.send();
            });
        });
    }

    function initialiseTracking() {
        trackButtons();

        const event = new Event('page_load', null);
        event.send();
    }

    document.addEventListener('DOMContentLoaded', initialiseTracking);
})();