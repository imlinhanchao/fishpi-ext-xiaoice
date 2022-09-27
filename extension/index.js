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
    let iconPath = path.join(__dirname, "..", "public", "icon.svg");
    let Url = process.env.NODE_ENV == 'development' ? 
        "http://127.0.0.1:8080" :
        path.join(__dirname, "..", "dist", "index.html");
    context.setSidebar(iconPath, Url);
}
module.exports = { activate }