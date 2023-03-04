const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const { Conflict } = require('http-errors');
const gravatar = require('gravatar');

const signup = async (req, res) => {
  const { email, password, subscription } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Conflict(`Email ${email} in use`)
  }
  const avatarURL = gravatar.url(email);
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const result = await User.create({ email, password: hashPassword, subscription, avatarURL });
  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
    }
  })
}

module.exports = signup;