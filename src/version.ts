// @ts-ignore
import preval from "babel-plugin-preval/macro";

export const commit: string = preval`
const { execSync } = require('child_process');
const rawLog = execSync('git log --no-decorate -n 1', {
  encoding: 'utf-8',
});
module.exports = /commit ([a-z0-9]+)/gi.exec(rawLog)[1];
`;

export const version: string = preval`
const package = require("../package.json");
module.exports = package.version;
`;
