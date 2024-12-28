const express = require('express');
const sequelize = require('./config/db.config');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const caseRoutes = require('./routes/case.routes');
const clientRoutes = require('./routes/client.routes');
const aiModelRoutes = require('./routes/ai-model.routes');
const teethRoutes = require('./routes/teeth.routes');
const refreshTokenRoutes = require('./routes/refreshToken.routes');
const config = require('./config/config');
const verifyJwt = require('./middlewares/verifyJwt');
const fs = require('fs');
const path = require('path');
const multerError = require('./middlewares/multer');
const Role = require('./models/role.model');
const app = express();

require('dotenv').config();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(multerError);

app.use('/api', authRoutes);
app.use('/api', refreshTokenRoutes);

//app.use(verifyJwt);
app.use('/api', clientRoutes);
app.use('/api', caseRoutes);
app.use('/api', teethRoutes);
app.use('/api', aiModelRoutes);

const PORT = config.dev.port;

sequelize.sync({ force: true }).then(async () => {
    await Role.bulkCreate([
      { name: 'user' },
      { name: 'admin' },
    ]);
  
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
