const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
// For salting passwords
const SALT_WORK_FACTOR = 10;

// User schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  role: {
    type: String
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  }
});

// Hash and salt passwords before saving to db
UserSchema.pre("save", function(next) {
  const user = this;
  // Save all emails as lowercase in db
  user.email = user.email && user.email.toLowerCase();
  // Salt user password
  if (user.isModified("password")) {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) return next(err);
      // Hash
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        // Set password to be the hashed one
        user.password = hash;
        next();
      });
    });
  }  else {
    return next();
  }
});

// Instance method to check if the password entered matches the password in the db
UserSchema.methods.authenticate = function(enteredPassword) {
  console.log("enteredPassword",enteredPassword);
    return new Promise((resolve, reject) =>
      bcrypt.compare(enteredPassword, this.password, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    );
  };

// When sending data from db to anywhere, send everything except password
UserSchema.set("toJSON", {
  transform(doc, ret, options) {
    return _.omit(ret, ["password"]);
  }
});

module.exports = mongoose.model("User", UserSchema);
