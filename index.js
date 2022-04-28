const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('glob');
const fs = require('fs');
const jsYaml = require('js-yaml');
const { spawnSync } = require('child_process')
const path = require("path");

try {
  const fileName = core.getInput('name');
  const owner = core.getInput('owner');
  let srcRevision = core.getInput('srcRevision').replace('refs/heads/', '');
  const destRevision = core.getInput('destRevision').replace('refs/heads/', '');

  if (owner == '') {
    throw new Error('owner is required');
  }
  glob('**/'+fileName, (err, files) => {
    files.forEach(file => {
      const yamlData = fs.readFileSync(file, 'utf-8');
      const data = jsYaml.load(yamlData);
      if (data['kind'] == 'Application') {
        write(file, data, owner, srcRevision, destRevision);
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
function write(fileName, data, owner, srcRevision, destRevision) {
  const repoURL = data['spec']['source']['repoURL']
  const targetRevision = data['spec']['source']['targetRevision']

  // GithubOwnerチェック
  if (owner == repoURL.split('/')[3]) {
    // 変更元リビジョンが指定されている場合は、現状のtargetRevisionが一致している場合しか書き換えない
    if (srcRevision != '' && srcRevision != targetRevision) {
      return;
    }
    if (destRevision == 'main') {
      // mainブランチが指定されている場合はHEAD指定
      destRevision = 'HEAD'
    }
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
