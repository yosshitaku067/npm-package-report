import { execSync } from 'child_process';
import { chdir } from 'process';

type NpmLsJsonOutpput = {
    version: string;
    name: string;
    dependencies: { [name: string]: { version: "18.15.0", resolved: string, overridden: boolean } }
}

type NpmViewOutput = {
    _id:                     string;
    _rev:                    string;
    name:                    string;
    description:             string;
    maintainers:             string[];
    author:                  string;
    repository:              Repository;
    homepage:                string;
    keywords:                string[];
    bugs:                    Bugs;
    readmeFilename:          string;
    license:                 string;
    _cached:                 boolean;
    _contentLength:          number;
    version:                 string;
    main:                    string;
    typings:                 string;
    packageManager:          string;
    volta:                   Volta;
    _integrity:              string;
    _resolved:               string;
    _from:                   string;
    _nodeVersion:            string;
    _npmVersion:             string;
    _npmUser:                string;
    _npmOperationalInternal: NpmOperationalInternal;
    _hasShrinkwrap:          boolean;
}

type Repository = {
    type: string;
    url:  string;
}

type NpmOperationalInternal = {
    host: string;
    tmp:  string;
}

type Bugs = {
    url: string;
}

export type Volta = {
    node: string;
    npm:  string;
}


chdir("/ここでレポートを出したいディレクトリのパスを書く/")

const result = ['| name | version | url | repository | homepage | maintainers | license |'];
result.push('|:--------|:--------|:---|:------------|:----------|:-----|:-----|');
const listStdout = execSync('npm list --json');
const npmListJson: NpmLsJsonOutpput = JSON.parse(listStdout.toString());

for (const [name, pkg] of Object.entries(npmListJson.dependencies)) {
    const viewStdout = execSync(`npm view ${name}@${pkg.version} --json`);
    const npmViewJson: NpmViewOutput = JSON.parse(viewStdout.toString());

    result.push(`|${name}|${pkg.version}|https://www.npmjs.com/package/${name}|type:${npmViewJson.repository.type} -> ${npmViewJson.repository.url}|${npmViewJson.homepage}|${npmViewJson.maintainers.length}| ${npmViewJson.license} |`)
}


const mdtext = result.join('\n');

console.log(mdtext);
