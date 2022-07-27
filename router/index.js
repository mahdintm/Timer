import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import { io } from '../app.js';

export const router = express.Router();

router.get("/", (req, res) => {
    if (!req.cookies.token_socket) {
        res.cookie("token_socket", uuidv4(), {
            maxAge: 3600000
        })
    }
    res.render("index", {});

});
router.get("/admin", (req, res) => {
    res.status(200);
    res.render("admin", { pageTitle: "Admin" });
    res.end();
});

router.get("/notfound", (req, res) => {
    res.status(404);
    res.render("404", { pageTitle: "صفحه مورد نظر پیدا نشد" });
    res.end();
});

router.post('/api/setTimer', (req, res) => {
    io.emit('Timer', req.body.timer)
    res.redirect('/admin')
})
router.post('/api/pause', (req, res) => {
    io.emit('pause')
    res.redirect('/admin')
})
router.post('/api/reset', (req, res) => {
    io.emit('reset')
    res.redirect('/admin')
})