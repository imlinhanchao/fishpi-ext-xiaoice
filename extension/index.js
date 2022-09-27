/* eslint-disable no-unused-vars */
const path = require('path');

function activate(context, electron) {
    context.on('login', function(token) {
        console.dir(token);
        login(context);
    })

    context.on('logout', () => {
        console.dir('user logout')
    })

    context.on('quit', () => {
        console.dir('app was quit')
    })

    context.on('command', (command, args) => {
        
    })
}

function login(context) {
    let iconPath = path.join(__dirname, "..", "public", "icon.png");
    let HtmlPath = path.join(__dirname, "..", "dist", "index.html");
    context.setSidebar(iconPath, HtmlPath);
}
module.exports = { activate }