// imports
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
// const csrf = require('csurf');

// sets the port for the server to use
const port = process.env.PORT || process.env.NODE_PORT || 3001;

// sets the url for the connected database
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/Portfolio';

// trys to connect to the database
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// get the routers for the program
const router = require('./router.js');

const app = express();

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json({}));

// app.registerPartials(`${__dirname}/../views/partials`);
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

// uses csrf to prevent suspicious requests
// app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSFTOKEN') {
    return next(err);
  }

  console.log('Missing CSRF token');
  return false;
});

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
