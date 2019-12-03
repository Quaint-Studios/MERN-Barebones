import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import './schemas/SchemaConfigs';
import app from '@express/express.main';
import { debug } from '../../utils/Essentials';

// Tells us when events have happened (create, touch, update, set, destroy).
const MongoStore = connectMongo(session);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_ADDR}/${process.env.DB_NAME}?retryWrites=true`, { useNewUrlParser: true });

// Exposes the MongoDB connection to other files.
export const db = mongoose.connection;

// #region Event Handling for the database
db.on('error', (err) => {
  debug(`A MongoDB error occurred: ${err}`, true);
});
db.once('open', () => {
  debug('Opened MongoDB.');
});
db.on('connected', () => {
  debug('Mongoose connection has been made.');
});
db.on('disconnected', () => {
  debug('Mongoose connection has been terminated.');
});

process.on('SIGINT', () => {
  db.close(() => {
    debug('Mongoose default connection disconnected through app termination.');
    process.exit(0);
  });
});
// #endregion

// Link the DB structure with express and use a session.
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));
