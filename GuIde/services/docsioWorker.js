/* eslint no-console: 0 */
import chp from 'child_process';
import path from 'path';
import { EventEmitter } from 'events';
import Redis from 'ioredis';
import co from 'co';
import { workerQueueKey, skippedQueueKey, processingQueueKeyFn } from '../universal/constants';

const client = new Redis();
const workEmitter = new EventEmitter();
const processingQueue = processingQueueKeyFn('docsiobuild');

const handlers = {
  python2: (srcDir) => {
    const cwdBackup = process.cwd();
    try {
      process.chdir(srcDir);
      chp.execSync('hg pull -u');
      chp.execSync('hg update 2.7');
      process.chdir(path.join(srcDir, 'Doc'));
      chp.execSync('source ../venv3/bin/activate && make html');
      chp.execSync('rsync -aAXv ./build/html/ ~/kspace/docs/python2/ --delete');
      chp.execSync('make clean');
      chp.execSync('hg update default');
      process.chdir(cwdBackup);
    } catch (e) {
      console.log(e);
    }
    return true;
  },
  python3: srcDir => {
    const cwdBackup = process.cwd();
    try {
      process.chdir(srcDir);
      chp.execSync('hg pull -u', { stdio: [0, 1, 2] });
      process.chdir(path.join(srcDir, 'Doc'));
      chp.execSync(
        'source ../venv3/bin/activate && make html',
        { stdio: [0, 1, 2] }
      );
      chp.execSync(
        'rsync -aAXv ./build/html/ ~/kspace/docs/python3/ --delete',
        { stdio: [0, 1, 2] }
      );
      chp.execSync('make clean');
      process.chdir(cwdBackup);
    } catch (e) {
      console.log(e);
    }
    return true;
  },
  go: srcDir => {
    const cwdBackup = process.cwd();
    try {
      process.chdir(path.join(srcDir, 'src'));
      chp.execSync('git pull');
      chp.execSync('GOROOT_BOOTSTRAP=$HOME/gshare/codebase/vm/go1.4.2.amd64/ ./all.bash');
      process.chdir(srcDir);
      chp.execSync('rsync -aAXv --delete bin src lib doc misc pkg ~/kspace/goroot/');
      chp.execSync('go get golang.org/x/tools/cmd/...', { stdio: [0, 1, 2] });
      process.chdir(cwdBackup);
    } catch (e) {
      console.log(e);
    }
    return true;
  },
  rust: srcDir => {
    const cwdBackup = process.cwd();
    try {
      process.chdir(srcDir);
      chp.execSync('git pull');
      chp.execSync(`cd build && ../configure && make &&
        make install CFG_DISABLE_LDCONFIG=true CFG_DISABLE_DOCS=true &&
        make docs NO_REBUILD=1 && make clean`);
      chp.execSync('rsync -aAXv --delete doc/ ~/kspace/docs/rust/');
      process.chdir(cwdBackup);
    } catch (e) {
      console.log(e);
    }
    return true;
  },
  flask: srcDir => {
    const cwdBackup = process.cwd();
    try {
      process.chdir(srcDir);
      chp.execSync('git pull');
      chp.execSync('source ./venv/bin/activate && make docs');
      chp.execSync('rsync -aAXv ./_build/html/ ~/kspace/docs/flask/ --delete');
      chp.execSync('rm -rf html');
      process.chdir(cwdBackup);
    } catch (e) {
      console.log(e);
    }
    return true;
  },
  jinja2: srcDir => {
    const cwdBackup = process.cwd();
    try {
      process.chdir(path.join(srcDir, 'doc'));
      chp.execSync('git pull');
      chp.execSync('source ../venv2/bin/activate && make html');
      chp.execSync('rsync -aAXv ./_build/html/ ~/kspace/docs/jinja2/ --delete');
      chp.execSync('make clean');
      process.chdir(cwdBackup);
    } catch (e) {
      console.log(e);
    }
    return true;
  },
  react: srcDir => {
    const cwdBackup = process.cwd();
    try {
      process.chdir(path.join(srcDir, 'docs'));
      chp.execSync('git pull');
      chp.execSync('gem update');
      chp.execSync('npm install');
      chp.execSync('gem server');
      process.chdir(cwdBackup);
    } catch (e) {
      console.log(e);
    }
    return true;
  },
  angular1: srcDir => {
    const cwdBackup = process.cwd();
    try {
      process.chdir(srcDir);
      chp.execSync('git pull');
      chp.execSync('npm install');
      process.chdir(cwdBackup);
    } catch (e) {
      console.log(e);
    }
    return true;
  },
  // android-sdk: intellij
  mdn: () => {
    console.log('we need a crawler');
    return true;
  },
};

let exiting = false;

process.on('SIGINT', () => {
  if (exiting) process.exit(0); // If pressed twice.
  console.log(`
    Received SIGINT.
    Please wait until the current task is finished. Or one more to force exit.
  `);
  exiting = true;
});

function onNextTask() {
  co(function* nextTask() {
    console.log('lrange begin');
    const tasks = yield client.lrange(processingQueue, 0, 0);
    console.log('lrange', tasks);
    if (tasks.length > 0) {
      console.log('resumed task', tasks[0]);
      workEmitter.emit('process', tasks[0]);
    } else if (exiting) {
      console.log('Exiting');
      process.exit(0);
    } else {
      const task = yield client.brpoplpush(
        workerQueueKey, processingQueue, 0
      );
      workEmitter.emit('process', task);
    }
  });
}

function onProcessTask(task) {
  co(function* process() {
    const payload = JSON.parse(task);
    if (payload.type === 'docsio' && handlers[payload.name]) {
      const result = handlers[payload.name](payload.from);
      if (result) {
        // todo socket.io rethinkdb
        workEmitter.emit('processed', task);
      } else {
        workEmitter.emit('skipped', task);
      }
    } else {
      workEmitter.emit('processed', task);
      yield client.lpush(workerQueueKey, task);
    }
  });
}

function onProcessedTask(task) {
  co(function* processed() {
    yield client.lrem(processingQueue, -1, task);
    workEmitter.emit('finished');
  });
}

function onSkippedTask(task) {
  co(function* skipped() {
    yield client.lpush(skippedQueueKey, task);
    workEmitter.emit('processed');
  });
}

workEmitter.on('start', onNextTask);
workEmitter.on('process', onProcessTask);
workEmitter.on('processed', onProcessedTask);
workEmitter.on('skipped', onSkippedTask);
workEmitter.on('finished', onNextTask);

workEmitter.emit('start');

// https://github.com/bmdako/BerlingskeMQ
// http://big-elephants.com/2013-09/building-a-message-queue-using-redis-in-go/   https://github.com/adjust/redismq
// http://programmers.stackexchange.com/questions/204623/how-to-implement-a-message-queue-over-redis
