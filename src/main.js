import App from './App.svelte';

document.addEventListener("DOMContentLoaded", function() {
    var app = new App({
        target: document.body
        // target: document.getElementById('pathfinder-dashboard-container')
    });
});

export default app;