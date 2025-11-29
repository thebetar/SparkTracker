const SUPABASE_URL = 'https://qcginwkfkawkktlmdiwa.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qKwdg4z8WaFaMILkWU6a8w_70UrxeQ5';

export class Event {
    /**
     * @param {string} name 
     * @param {number} scroll
     * @param {number} duration
     * @param {HTMLElement} element 
     */
    constructor(name, scroll = 0, duration = 0, element = null) {
        this.name = name;
        this.element = element;
        this.scroll = scroll;
        this.duration = duration;
        this.url = window.location.href;
        this.referrer = document.referrer;
        this.language = navigator.language || navigator.userLanguage;
        this.userAgent = navigator.userAgent;
        this.screenWidth = window.screen.width;
        this.screenHeight = window.screen.height;
        this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    getUserId() {
        let userId = localStorage.getItem('vonk_tracker_user_id');

        if (!userId) {
            userId = crypto.randomUUID();
            localStorage.setItem('vonk_tracker_user_id', userId);
        }

        return userId;
    }

    toJSON() {
        return {
            // Primary info
            name: this.name,
            url: this.url,
            user_id: this.getUserId(),

            // Secondary info
            scroll: this.scroll,
            duration: this.duration,
            timezone: this.timezone,
            language: this.language,

            // Additional info
            referrer: this.referrer,
            user_agent: this.userAgent,
            screen_width: this.screenWidth,
            screen_height: this.screenHeight,

            element: this.element ? {
                tagName: this.element.tagName,
                id: this.element.id || null,
                classes: this.element.className || null,
                text: this.element.innerText || this.element.value || null
            } : null
        };
    }

    send() {
        fetch(`${SUPABASE_URL}/rest/v1/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(this.toJSON())
        }).catch(err => console.error('Error sending event data:', err));
    }
}