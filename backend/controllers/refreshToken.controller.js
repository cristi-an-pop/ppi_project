const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');

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

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }
  
    try {
      const user = await User.findOne({ where: { refreshToken } });
      if (!user) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
      jwt.verify(refreshToken, refreshTokenSecret, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const roleRecord = await Role.findByPk(user.roleId);

        const { accessToken, newRefreshToken } = generateTokens(user, roleRecord);
        await user.update({ refreshToken: newRefreshToken });
  
        // // Set new refresh token in HTTP-only cookie
        // res.cookie('refreshToken', newRefreshToken, {
        //   httpOnly: true,
        //   maxAge: 7 * 24 * 60 * 60 * 1000,
        // });
  
        res.json({ accessToken, role: roleRecord.name, username: user.username });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

// Revoke / Logout
const revokeToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }
  
    try {
      const user = await User.findOne({ where: { refreshToken } });
      if (!user) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
  
      await user.update({ refreshToken: null });
  
      res.clearCookie('refreshToken', {
        httpOnly: true,
      });
  
      res.json({ message: 'Refresh token revoked' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

module.exports = { refreshToken, revokeToken };