import { jest } from '@jest/globals';

global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));
window.scrollTo = jest.fn();
import '../src/vonk-tracker.js';

describe('vonk-tracker', () => {
    beforeEach(() => {
        global.fetch.mockClear();
        document.body.innerHTML = '';

        Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 });
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1000 });
        Object.defineProperty(document.documentElement, 'scrollHeight', { writable: true, configurable: true, value: 2000 });
    });

    it('should send a page_load event on DOMContentLoaded', () => {
        document.dispatchEvent(new Event('DOMContentLoaded'));
        expect(global.fetch).toHaveBeenCalled();
        const body = JSON.parse(global.fetch.mock.calls[0][1].body);
        expect(body.name).toBe('page_load');
    });

    it('should send a button_click event when a button is clicked', () => {
        document.body.innerHTML = '<button id="test-btn">Click me</button>';
        document.dispatchEvent(new Event('DOMContentLoaded'));
        global.fetch.mockClear();

        const btn = document.getElementById('test-btn');
        btn.click();

        expect(global.fetch).toHaveBeenCalled();
        const body = JSON.parse(global.fetch.mock.calls[0][1].body);
        expect(body.name).toBe('button_click');
        expect(body.element.tagName).toBe('BUTTON');
    });

    it('should send a scroll_depth_pixel event when pixel milestone is reached', () => {
        document.dispatchEvent(new Event('DOMContentLoaded'));
        global.fetch.mockClear();

        Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 150 });
        window.dispatchEvent(new Event('scroll'));

        expect(global.fetch).toHaveBeenCalled();
        const body = JSON.parse(global.fetch.mock.calls[0][1].body);
        expect(body.name).toBe('scroll_depth_pixel');
        expect(body.scroll).toBe(100);
    });

    it('should send scroll_depth_percentage events for 50% and 100% milestones', () => {
        document.dispatchEvent(new Event('DOMContentLoaded'));
        global.fetch.mockClear();

        Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 500 });
        window.dispatchEvent(new Event('scroll'));

        Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 1000 });
        window.dispatchEvent(new Event('scroll'));

        const calls = global.fetch.mock.calls.map(call => JSON.parse(call[1].body));
        const found50 = calls.find(body => body.name === 'scroll_depth_percentage' && body.scroll === 50);
        const found100 = calls.find(body => body.name === 'scroll_depth_percentage' && body.scroll === 100);

        expect(found50).toBeTruthy();
        expect(found100).toBeTruthy();
    });

    it('should send a session_end event on beforeunload', () => {
        document.dispatchEvent(new Event('DOMContentLoaded'));
        global.fetch.mockClear();

        window.dispatchEvent(new Event('beforeunload'));

        expect(global.fetch).toHaveBeenCalled();
        const body = JSON.parse(global.fetch.mock.calls[0][1].body);
        expect(body.name).toBe('session_end');
    });
});
