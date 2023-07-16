const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const users = require("../database/model/users");
const cloudinary = require("../cloudinary");
const { use } = require("../app");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      FullName: user.FullName,
      password: user.password,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "24h",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { email: user.email, FullName: user.FullName, password: user.password },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "30d",
    }
  );
};

require("dotenv").config();

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const results = await users.getAllUsers();
      console.log(results);
      res.json(results);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  getOneUser: async (req, res) => {
    // Add authentication middleware to secure this route
    try {
      const id_user = req.params.id_user;
      const results = await users.getOneUser(id_user);
      res.json(results);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  addNewUser: async (req, res) => {
    const { email, FullName, username, password, img_profile_user } = req.body;

    try {
      const result = await cloudinary.uploader.upload(img_profile_user, {
        folder: "products",
      });
      console.log(result.secure_url);
      const hashedPassword = await bcrypt.hash(password, 10);
      const secureUser = generateRefreshToken({ email }); // Generating secureUser value

      const user = {
        email,
        FullName,
        username,
        password: hashedPassword,
        img_profile_user: result.secure_url || img_profile_user,
        secureUser,
      };

      const data = await users.addUser(user);

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({ accessToken, refreshToken, data });
    } catch (err) {
      console.log(err);
      res.status(500).send("user already exist");
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await users.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      res.json({ accessToken, refreshToken, user });
    } catch (error) {
      console.error(error);
      res.status(500).send("something wrong");
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const results = await users.deleteUser(userId);
      res.json(results);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  updateUser: async (req, res) => {
    // Add authentication middleware to secure this route
    try {
      const userId = req.params.id;
      const updatedData = req.body;

      const results = await users.updateUser(userId, updatedData);
      res.json(results);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
