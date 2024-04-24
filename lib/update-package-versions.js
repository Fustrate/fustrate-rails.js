import { exec } from 'node:child_process';

import packageJson from '../package.json' assert { type: 'json' };

const skipVersions = /http|rc|beta|pre/;

const packages = Object.keys(packageJson.dependencies)
  .filter((name) => !skipVersions.test(packageJson.dependencies[name]));

const devPackages = Object.keys(packageJson.devDependencies)
  .filter((name) => !skipVersions.test(packageJson.devDependencies[name]));

exec(`npm install ${packages.join(' ')} && npm install -D ${devPackages.join(' ')}`);
