'use strict';

let pkg = require('@project/package.json');
module.exports = require('@root/greenlock').create({
    // name & version for ACME client user agent
    packageAgent: pkg.name + '/' + pkg.version,

    // contact for security and critical bug notices
    maintainerEmail: process.env.SSL_EMAIL,

    // where to find .greenlockrc and set default paths
    packageRoot: "./"
});
