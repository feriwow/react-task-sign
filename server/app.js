const express = require('express');
const router = require('./routers')
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')
const FRONT_END_URL = process.env.FRONT_END_URL

const corsOptions = {
  origin: FRONT_END_URL,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(router)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});