import { exec } from "node:child_process";

import packageJson from "../package.json" with { type: "json" };

const skipVersions = /http|rc|beta|pre/;

const packages = Object.entries(packageJson.dependencies)
	.map(([name, version]) => (skipVersions.test(version) ? null : name))
	.filter(Boolean);

const devPackages = Object.entries(packageJson.devDependencies)
	.map(([name, version]) => (skipVersions.test(version) ? null : name))
	.filter(Boolean);

exec(`npm install ${packages.join(" ")} && npm install -D ${devPackages.join(" ")}`);
