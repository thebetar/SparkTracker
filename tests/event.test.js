import { Event } from '../src/event.js';
import { jest } from '@jest/globals';

describe('Event', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));
    });

    it('should create an Event instance with correct properties', () => {
        const event = new Event('test_event', 10, 5, document.body);

        // Check properties
        expect(event.name).toBe('test_event');
        expect(event.scroll).toBe(10);
        expect(event.duration).toBe(5);
        expect(event.element).toBe(document.body);

        // Check property types
        expect(typeof event.url).toBe('string');
        expect(typeof event.referrer).toBe('string');
        expect(typeof event.language).toBe('string');
        expect(typeof event.userAgent).toBe('string');
        expect(typeof event.screenWidth).toBe('number');
        expect(typeof event.screenHeight).toBe('number');
        expect(typeof event.timezone).toBe('string');
    });

    it('should generate a user id and store it in localStorage', () => {
        localStorage.removeItem('vonk_tracker_user_id');

        const event = new Event('test');
        const userId = event.getUserId();

        expect(typeof userId).toBe('string');
        expect(localStorage.getItem('vonk_tracker_user_id')).toBe(userId);
    });

    it('should return a valid JSON object', () => {
        const event = new Event('test_event', 10, 5, document.body);
        const json = event.toJSON();

        expect(json.name).toBe('test_event');
        expect(json.scroll).toBe(10);
        expect(json.duration).toBe(5);
        expect(json.element.tagName).toBe('BODY');
    });

    it('should call fetch with correct arguments when send is called', () => {
        const event = new Event('send_event', 42, 7, document.body);
        event.send();
        expect(global.fetch).toHaveBeenCalledTimes(1);

        const [url, options] = global.fetch.mock.calls[0];
        expect(url).toMatch(/supabase/);
        expect(options.method).toBe('POST');
        expect(options.headers['Content-Type']).toBe('application/json');

        const body = JSON.parse(options.body);
        expect(body.name).toBe('send_event');
        expect(body.scroll).toBe(42);
        expect(body.duration).toBe(7);
        expect(body.element.tagName).toBe('BODY');
    });
});
