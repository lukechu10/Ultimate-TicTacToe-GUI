const hotkeys = require('hotkeys-js');

// prevent reload
hotkeys('f5', (event, handler) => {
    // Prevent the default refresh event under WINDOWS system
    event.preventDefault();
});
hotkeys('ctrl+r, command+r', (event, handler) => {
    event.preventDefault();
});

$(() => {
    window.link = new LinkInstance({
        replaceHead: true,
        linkId: [
            "#content"
        ]
    });
});