const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('glob');
const fs = require('fs');
const jsYaml = require('js-yaml');
const { spawn } = require('child_process')

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
  const app = spawn('bash', [path.join(__dirname, './gitCommand.sh')]);
  app.on('close', code => {
    if(code !== 0){
      err = new Error(`Invalid status code: ${code}`);
      err.code = code;
      return reject(err);
    };
    return resolve(code);
  });
  app.on('error', reject);
}