import { exec } from "node:child_process";

import { dependencies, devDependencies } from "../package.json" with { type: "json" };

const skipVersions = /http|rc|beta|pre/;

const packages = Object.entries(dependencies)
	.map(([name, version]) => (skipVersions.test(version) ? null : name))
	.filter(Boolean);

const devPackages = Object.entries(devDependencies)
	.map(([name, version]) => (skipVersions.test(version) ? null : name))
	.filter(Boolean);

exec(`bun install ${packages.join(" ")} && bun install -D ${devPackages.join(" ")}`);
