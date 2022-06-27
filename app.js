import express from 'express';
import http from 'http';
import { router } from './router/index.js';
import path from 'path';
import bodyParser from 'body-parser';
import { Errorpage } from './router/Error.js';
import cookieParser from 'cookie-parser';
// import session from 'express-session'
import { Server } from 'socket.io';
var app = express();
let app_HTTP = http.createServer(app).listen(3001);
export let io = new Server(app_HTTP)
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));
export let socketusers = {};
//EJS
app.set("view engine", "ejs");
app.set("views", "views");
//End of EJS

io.on('connection', (sso) => {
    console.log(sso.conn.remoteAddress)
    setTimeout(() => {
        if (getCookiefromstring(sso.handshake.headers.cookie, "token_socket") != null) {
            socketusers[getCookiefromstring(sso.handshake.headers.cookie, "token_socket")] = sso.id
        } else {
            io.to(sso.id).emit("roloadpage")
        }
    }, 100);

    sso.on('disconnect', (socket) => {
        // console.log('user disconnected -> ', socket);
    });
    sso.on('chat', (msg) => {
        // console.log('message: ' + msg);
    });

});

export function socketemitclient(token, nameevent, args = null) {
    setTimeout(() => {
        io.emit(socketusers[token]).emit(nameevent, args)
    }, 500);
}

function getCookiefromstring(cookie, name) {
    cookie = ";" + cookie;
    cookie = cookie.split("; ").join(";");
    cookie = cookie.split(" =").join("=");
    cookie = cookie.split(";" + name + "=");
    if (cookie.length < 2) {
        return null;
    } else {
        return decodeURIComponent(cookie[1].split(";")[0]);
    }
}


//Routes
app.use(router);

app.use(Errorpage);