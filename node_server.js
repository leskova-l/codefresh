const express = require('express');

const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const logs = require('./logs');

const { steps } = logs;
const { port } = require('./src/config');

const generateTime = () => {
  return Math.random() * 3000;
};

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


async function createTerminal(socket) {
  for (let i = 0; i < steps.length; i++) {
    await sendSteps(socket, steps[i]);
  }
  return 'done';
}

async function sendLogs(socket, step) {
  for (let i = 0; i < step.logs.length; i++) {
    await sendLog(socket, step.name, step.logs[i]);
  }
  return 'done step';
}
function sendSteps(socket, step) {
  return new Promise((resolve) => {
    setTimeout(() => {
      socket.emit('step', { name: step.name, log: '' });
      sendLogs(socket, step)
        .then(() => {
          resolve('ok');
        });
    }, generateTime());
  });
}

function sendLog(socket, name, log) {
  return new Promise((resolve) => {
    setTimeout(() => {
      socket.emit('step', { name, log });
      resolve('send log');
    }, generateTime());
  });
}

io.sockets.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('disconnected');
  });

  socket.on('build', (data) => {
    if (data.msg === 'build') {
      createTerminal(socket)
        .then((res) => {
          console.log(res);
        });
    }
  });
});

server.listen(port, (e) => {
  if (e) {
    console.error(e);
  } else {
    console.info('Open up http://localhost:%s/ in your browser.', port);
  }
});
