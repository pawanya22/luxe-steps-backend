// js/api.js
const api = {
    url: 'http://localhost:5000/api', // Replace with production URL when live
    async fetch(endpoint, method = 'GET', data = null) {
        const config = {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: data ? JSON.stringify(data) : null
        };
        try {
            const res = await fetch(`${this.url}${endpoint}`, config);
            return await res.json();
        } catch (err) {
            // Graceful error handling for the frontend demo
            return { success: false, message: "Server connection failed" };
        }
    }
};