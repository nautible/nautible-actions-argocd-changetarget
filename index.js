const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('glob');
const fs = require('fs');
const jsYaml = require('js-yaml');
const { spawnSync } = require('child_process')
const path = require("path");

try {
  const fileName = core.getInput('name');
  const srcRevision = core.getInput('srcRevision').replace('refs/heads', '');
  const destRevision = core.getInput('destRevision').replace('refs/heads', '');

  glob('**/'+fileName, (err, files) => {
    files.forEach(file => {
      const yamlData = fs.readFileSync(file, 'utf-8');
      const data = jsYaml.load(yamlData);
      if (data['kind'] == 'Application') {
        write(file, data, srcRevision, destRevision);
      }
    });
    gitCommand()
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    });
} catch (error) {
  core.setFailed(error.message);
}

// ファイル出力処理
function write(fileName, data, srcRevision, destRevision) {
  const currentRevision = data['spec']['source']['targetRevision']
  if (currentRevision == srcRevision) {
    data['spec']['source']['targetRevision'] = destRevision
    const text = jsYaml.dump(data);
    fs.writeFileSync(fileName, text, 'utf-8')
  }
}

// Gitへのcommit & push
function gitCommand() {
  const app = spawnSync('bash', [path.join(__dirname, './gitCommand.sh')]);
  if (app.error != undefined && app.error != null) {
    throw app.error
  }
}