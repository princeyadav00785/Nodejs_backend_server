const asyncHandler = require("express-async-handler");
const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @Des Register a user
// @route POST api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are necessary!");
  }
  const userAvailable = await user.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("E-mail is already is in use..");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password is:", hashedPassword);

  const User = await user.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(`User created ${User}`);

  if (User) {
    res.status(201).json({ _id: User.id, email: User.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

// @Des login user
// @route post  api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory..");
  }
  const User = await user.findOne({ email });
  //  password comparison
  if (User && (await bcrypt.compare(password, User.password))) {
    const accessToken = jwt.sign(
      {
        User: {
          username: User.username,
          email: User.email,
          id: User.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Credentials are not valid !");
  }
});

// @Des  user information
// @route GET  api/users/Current
// @access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.User);
});

module.exports = { registerUser, loginUser, currentUser };
