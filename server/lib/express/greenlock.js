'use strict';

var pkg = require('@project/package.json');
module.exports = require('@root/greenlock').create({
    // name & version for ACME client user agent
    packageAgent: pkg.name + '/' + pkg.version,

    // contact for security and critical bug notices
    maintainerEmail: "ssl@example.com",

    // where to find .greenlockrc and set default paths
    packageRoot: "./"
});
