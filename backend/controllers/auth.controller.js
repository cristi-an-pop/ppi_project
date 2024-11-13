const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user.model');
const Role = require('../models/role.model');

require('dotenv').config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'accessTokenSecret';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refreshTokenSecret';

// Helper function to generate tokens
const generateTokens = (user, roleRecord) => {
  const accessToken = jwt.sign(
    { userId: user.id, role: roleRecord.name },
    accessTokenSecret,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, role: roleRecord.name },
    refreshTokenSecret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Register
const register = async (req, res) => {
  console.log(req.body)
  const { username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const roleRecord = await Role.findOne({ where: { name: role } });
    if (!roleRecord) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      id: uuidv4(),
      username,
      password: hashedPassword,
      roleId: roleRecord.id,
    });

    res.json(newUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login
const login = async (req, res) => {
  const { username, password } = req.body;
console.log(req.body)
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const roleRecord = await Role.findByPk(user.roleId);

    const { accessToken, refreshToken } = generateTokens(user, roleRecord);
    await user.update({ refreshToken });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    res.json({ accessToken, role: roleRecord.name, username: user.username});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
    register,
    login,
};
