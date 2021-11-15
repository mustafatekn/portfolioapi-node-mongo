const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isEmpty, isEmail } = require("../util/validation");
const { JWT_SECRET } = require("../env.json");
const User = require("../models/users");

module.exports = {
  createUser: async (req, res) => {
    let errors = {};
    if (isEmpty(req.body.email)) errors.email = "email can not be empty";
    if (!errors.email) {
      if (!isEmail(req.body.email))
        errors.email = "email must be in email format";
    }
    if (isEmpty(req.body.password))
      errors.password = "password can not be empty";
    if (isEmpty(req.body.confirmPassword))
      errors.confirmPassword = "confirmPassword can not be empty";
    if (!errors.confirmPassword) {
      if (req.body.password != req.body.confirmPassword)
        errors.password = "passwords must match";
    }

    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    user
      .save()
      .then((result) => {
        res.send(result);
        return res.status(201).json(result);
      })
      .catch((err) => {
        if (err.code === 11000)
          err.code = "this email is already using by another user";
        return res.status(500).json({ error: err.code });
      });
  },

  login: async (req, res) => {
    let errors = {};
    if (isEmpty(req.body.email)) errors.email = "email can not be empty";
    if (!errors.email) {
      if (!isEmail(req.body.email))
        errors.email = "email must be in email format";
    }
    if (isEmpty(req.body.password))
      errors.password = "password can not be empty";

    if (Object.keys(errors).length > 0) {
      if (Object.keys(errors).length > 0) return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
      .then(async (result) => {
        if (result) {
          const correctPassword = await bcrypt.compare(
            req.body.password,
            result.password
          );
          if (!correctPassword) {
            return res.status(404).json({ error: "wrong email or password" });
          } else {
            const token = jwt.sign({ email: req.body.email }, JWT_SECRET, {
              expiresIn: 60 * 60,
            });
            res.send(token);
            return res.status(200).json(token);
          }
        } else {
          return res.status(404).json({ error: "wrong email or password" });
        }
      })
      .catch((err) => {
        return res.status(500).json({ error: err.code });
      });
  },

  deleteUser: async (req, res) => {
    await User.findByIdAndDelete(`${req.params.id}`)
      .then((result) => {
        if (!result) {
          return res.status(404).json({ error: "Seems like no user found" });
        }
        res.send(result);
        return res.status(200, result);
      })
      .catch((err) => {
        return res.status(500).json({ error: err.code });
      });
  },
};