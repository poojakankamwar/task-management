const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const Users = require("../models/user");
const {registerValidation, loginValidation} = require("../validation");
const Joi = require('joi');

// user registration
router.post("/signup", async (req, res, next) => {
  const {error} = registerValidation(req.body);
  if(error)
  return res.json({ success: false, message: error.details[0].message });
  const email = req.body.email.toLowerCase();
  Users.findOne({ "email": email })
    .exec()
    .then(user => {
      if (user)
        throw new Error(
          "An account with that email already exists."
        );
        else
        return Users.create(req.body);
    })
    .then(user => {
          return res
            .status(201)
            .json({ success: true, user, message:"Registration Successful"  });
    })
    .catch(err => {
      console.log(err);
      return res.json({ success: false, message: err.message });
    });
});



// user login
router.post("/login", async(req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  const {error} = loginValidation(req.body);
  if(error){
    return res.json({ success: false, message:  error.details[0].message });
  }
  //find if email exists
  Users.findOne({ email })
    .exec()
    .then(user => {
      if (user) return user;
    })
    .then(result =>{
      return Promise.all([result.authenticate(password), result]);
    })
    .then(result1 => {
      if (!result1[0] === true) {
        return res.json({
          success: false,
          message:
            "The login information you entered is incorrect. Please try again."
        });
      }
      const token = jwt.sign({ id: result1[1]._id }, process.env.APP_SECRET);
      res.header('auth-token', token).send({token,  message:"Login Successful", login:result1[1], success:true });
    })
    .catch(err => {
      return res.json({
        success: false,
        message: "Something went wrong. Please try again.",
        err: err
      });
    });
});

module.exports = router;
