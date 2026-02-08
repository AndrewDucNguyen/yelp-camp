const express = require('express')
const router = require('express.router')
const User = require('../models/user')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.exports('/register', async (req, res) => {
    res.send(req.body)
})

module.exports = router;