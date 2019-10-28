import path from 'path';

import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { isProductionMode } from '@utils/ServerEssentials';

const app = express();
export default app;

// Force https in production mode.
app.use((req, res, next) => {
  if (isProductionMode()) {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.get('host')}${req.url}`);
    }
    return next();
  }

  return next();
});

// Load the react web pages first.
app.use(express.static(path.join(process.cwd(), 'build')));

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Handle POST/GET requests by parsing the data.
app.use(bodyParser.json());

// Load the API if anything else matches it.
app.get(/^(?!(\/api))(.+)/, (req, res) => {
  res.sendFile(path.join(process.cwd(), 'build/index.html'));
});
