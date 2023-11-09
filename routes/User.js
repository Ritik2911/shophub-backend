const express = require('express');
const router = express.Router();
const {
  login,
  signUp,
  changePassword
} = require("../controllers/Auth")

  // Route for user login
  router.post("/login", login)
  
  // Route for user signup
  router.post("/signup", signUp)

  // Route for change password
  router.post("/changepassword", changePassword)
  
module.exports = router;

