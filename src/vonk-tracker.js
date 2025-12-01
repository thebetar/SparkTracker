import { Event } from './event.js';

(function () {
    const scrollMilestones = [
        { type: 'pixel', value: 100 },
        { type: 'pixel', value: 500 },
        { type: 'percentage', value: 50 },
        { type: 'percentage', value: 100 }
    ];

    const trackedElementsSet = new WeakSet();
    const scrollMilestonesSet = new Set();

    const startTime = Date.now();

    let interval;
    let maxScroll = 0;

    function getDuration() {
        return Math.round((Date.now() - startTime) / 1000);
    }

    function trackButtons() {
        const buttons = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');

        buttons.forEach(button => {
            if (trackedElementsSet.has(button)) {
                return;
            }

            trackedElementsSet.add(button);
            button.addEventListener('click', function (event) {
                const eventData = new Event('button_click', maxScroll, getDuration(), event.currentTarget);
                eventData.send();
            });

        });
    }

    function trackScroll() {
        const totalHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollableHeight = totalHeight - viewportHeight;
        const scrollTop = window.scrollY;

        const percentage = scrollableHeight > 0 ? Math.round((scrollTop / scrollableHeight) * 100) : 100;

        maxScroll = Math.max(maxScroll, scrollTop);

        scrollMilestones.forEach(milestone => {
            const key = `${milestone.type}-${milestone.value}`;
            if (scrollMilestonesSet.has(key)) {
                return;
            }

            let reached = false;
            if (milestone.type === 'pixel' && scrollTop >= milestone.value) {
                reached = true;
            } else if (milestone.type === 'percentage' && percentage >= milestone.value) {
                reached = true;
            }

            if (reached) {
                scrollMilestonesSet.add(key);
                const eventData = new Event(`scroll_depth_${milestone.type}`, milestone.value, getDuration());
                eventData.send();
            }
        });
    }

    function initialiseTracking() {
        trackButtons();
        interval = setInterval(trackButtons, 1000);

        window.addEventListener('scroll', trackScroll);

        const event = new Event('page_load');
        event.send();
    }

    window.addEventListener('beforeunload', () => {
        if (interval) {
            clearInterval(interval);
        }

        const eventData = new Event('session_end', maxScroll, getDuration());
        eventData.send();
    });

    window.addEventListener('load', initialiseTracking);
})();