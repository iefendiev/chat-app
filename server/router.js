const express = require('express');
const router = express.Router();
const cors = require('cors');

router.get('/', cors(), (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*');
  res.send('server is up and running!');
});

module.exports = router;
