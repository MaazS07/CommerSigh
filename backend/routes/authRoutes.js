const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middleware/authMiddleware'); 

router.use(cookieParser());

router.post('/', async (req, res) => {
  const idToken = req.body.idToken;
  const expiresIn = 60 * 60 * 24 * 60 * 1000; // 2 months

  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    const options = { maxAge: expiresIn, httpOnly: true, secure: true };

    res.cookie('session', sessionCookie, options);
    res.status(200).send('Login successful');
  } catch (error) {
    res.status(401).send('Unauthorized request');
  }
});

router.post('/', (req, res) => {
  res.clearCookie('session');
  res.status(200).send('Logout successful');
});

router.get('/', authMiddleware, (req, res) => {
  res.send(`Welcome, ${req.user.email}`);
});

module.exports = router;
