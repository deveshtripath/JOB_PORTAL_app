const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require('cors');
const path = require('path');
const errorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");


// import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobTypeRoute = require('./routes/jobsTypeRoutes');
const jobRoute = require('./routes/jobsRoutes');


//database connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err));


//MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  }
  app.use(bodyParser.json({ limit: "5mb" }));
  app.use(bodyParser.urlencoded({
    limit: "5mb",
    extended: true
  }));
  app.use(cookieParser());
  app.use(cors());

//ROUTES MIDDLEWARE
// app.get('/', (req, res) => {
//     res.send("Hello from Node Js");
// })
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', jobTypeRoute);
app.use('/api', jobRoute);

//static files
app.use(express.static(path.join(__dirname, "../frontend/client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/client/build/index.html"));
});

// error middleware
app.use(errorHandler);

//port
const port = process.env.PORT || 9000

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});