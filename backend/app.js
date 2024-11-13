const express = require('express');
const sequelize = require('./config/db.config');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const memberRoutes = require('./routes/member.routes');
const authRoutes = require('./routes/auth.routes');
const refreshTokenRoutes = require('./routes/refreshToken.routes');
const verifyJwt = require('./middlewares/verifyJwt');
const verifyAdminRole = require('./middlewares/verifyAdminRole');
const Member = require('./models/member.model');
const User = require('./models/user.model');
const Role = require('./models/role.model');
const app = express();

require('dotenv').config();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', refreshTokenRoutes);

app.use(verifyJwt);
app.use('/api', memberRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: true }).then(async () => {
    await Role.bulkCreate([
      { name: 'user' },
      { name: 'admin' },
    ]);
  
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
