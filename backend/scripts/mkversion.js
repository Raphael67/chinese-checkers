const { getFormattedVersion } = require('@corteks/gitversion');
const fs = require('fs');

(async () => {
    const versionObject = { version: await getFormattedVersion() };
    fs.writeFileSync('./src/version.json', JSON.stringify(versionObject));
})();
