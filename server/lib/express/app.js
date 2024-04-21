import http from 'http';
import PublicIP from 'public-ip';

import greenlock from 'greenlock-express';
// Use in the future:  import store from 'greenlock-store-fs';

import { debug, toBe } from '@utils/Essentials';
import { isProductionMode } from '@utils/ServerEssentials';

import app from './cfg';

export default app;

// Use the HTTPS port for production and 8182 for development.
const PORT = process.env.DEV_PORT || 8182;

function greenlockCreation() {
  // Check if the email has been set
  if (!toBe(process.env.SSL_EMAIL) || process.env.SSL_EMAIL === '') {
    throw new Error(`
Set SSL_EMAIL in the .env file and be sure to configure greenlock for your SSL setup.
You can also run the following commands to get yourself started:
    echo -e 'example1.com\\nexample2.org' | xargs -i -n1 npx greenlock add --subject {} --altnames {},subdomain1.{},subdomain2.{}\n\n

You can put several .tld domains at the beginning of the command and separate them with \\n.
Or you can just put one domain. It will pipe it to the next command, npx, and replace {} with each domain name you specified, looping through them all.
Subdomains are separated by commas, no spaces.

Afterwards, run the following to agree to the terms:
    npx greenlock defaults --subscriber-email 'ssl@example.com' --agree-to-terms`).toString();
  }

  return greenlock
    .init(() => ({
      greenlock: require('./greenlock.js'),

      // whether or not to run at cloudscale
      cluster: false
    }))
    .ready((glx) => {
      // Serves on 80 and 443
      // Get's SSL certificates magically!
      glx.serveApp(app);
    });
}

const server = isProductionMode() ? greenlockCreation() : http.createServer(app).listen(PORT);

export const listener = server;

PublicIP.v4().then((ip) => {
  debug(`Listening on ${isProductionMode() ? 'https://' : 'http://'}${process.env.HIDDEN_IP ? '127.0.0.1' : ip}:${isProductionMode() ? 443 : PORT}`);
});
