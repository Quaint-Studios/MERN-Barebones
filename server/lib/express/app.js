import http from 'http';
import PublicIP from 'public-ip';

import greenlock from 'greenlock-express';
import store from 'greenlock-store-fs';

import { debug } from '@utils/Essentials';
import { isProductionMode } from '@utils/ServerEssentials';

import app from './cfg';

export default app;

// Use the HTTPS port for production and 8182 for development.
const PORT = process.env.DEV_PORT || 8182;

const greenlockOptions = {
  email: process.env.SSL_EMAIL, // The email address of the ACME user / hosting provider
  agreeTos: true, // You must accept the ToS as the host which handles the certs
  configDir: process.env.SSL_DIR, // Writable directory where certs will be saved
  communityMember: false, // Join the community to get notified of important updates
  telemetry: false, // Contribute telemetry data to the project
  store,

  // Using your express app:
  // simply export it as-is, then include it here
  app

  // , debug: true
};

const server = isProductionMode() ? greenlock.create(greenlockOptions).listen(80, 443) : http.createServer(app).listen(PORT);

export const listener = server;

PublicIP.v4().then((ip) => {
  debug(`Listening on ${isProductionMode() ? 'https://' : 'http://'}${process.env.HIDDEN ? '127.0.0.1' : ip}:${isProductionMode() ? 443 : PORT}`);
});
