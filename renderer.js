// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

require('electron').ipcRenderer.on('update', function(event, message) {
    alert('Your application is up to date')
});

function openWebsite() {
    require('electron').shell.openExternal('http://www.pelayomendez.com/elderberry')
}
document.querySelector('a').addEventListener('click', (e) => { e.preventDefault; openWebsite() });