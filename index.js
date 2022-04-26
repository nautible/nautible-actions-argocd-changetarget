const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('glob');
const fs = require('fs');
const jsYaml = require('js-yaml');
const { spawnSync } = require('child_process')
const path = require("path");

try {
  // revision
  const fileName = core.getInput('name');
  const srcRevision = core.getInput('srcRevision');
  const destRevision = core.getInput('destRevision');
//   const fileName = 'application.yaml';
//   const srcRevision = 'develop';
//   const destRevision = 'HEAD';

  glob('**/'+fileName, (err, files) => {
    files.forEach(file => {
      const yamlData = fs.readFileSync(file, 'utf-8');
      const data = jsYaml.load(yamlData);
      if (data['kind'] == 'Application') {
        write(file, data, srcRevision, destRevision);
      }
    });
  });
  
  gitCommand()

  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
} catch (error) {
  core.setFailed(error.message);
}

function write(fileName, data, srcRevision, destRevision) {
  const currentRevision = data['spec']['source']['targetRevision']
  if (currentRevision == srcRevision) {
    data['spec']['source']['targetRevision'] = destRevision
    const text = jsYaml.dump(data);
    fs.writeFile(fileName, text, 'utf-8', (err) => {
        if (err) throw err;
    });    
  }
}

function gitCommand() {
  const app = spawnSync('bash', [path.join(__dirname, './gitCommand.sh')]);
  if (app.error != undefined && app.error != null) {
    throw app.error
  }
}