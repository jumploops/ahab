// websocket-server.js
const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  // Start a shell process for each WebSocket connection
  const shell = spawn(process.env.SHELL || 'bash', {
    env: { ...process.env }, // Pass environment variables to the child process
    shell: true
  });

  shell.stdout.on('data', (data) => {
    // When the shell outputs data, send it back to the WebSocket client
    ws.send(data.toString());
  });

  shell.stderr.on('data', (data) => {
    // Send shell error data to the WebSocket client
    ws.send(data.toString());
  });

  shell.on('close', (code) => {
    // The shell process has closed, so close the WebSocket connection
    ws.close();
  });

  ws.on('message', (message) => {
    // Send received message directly to the shell as a command
    shell.stdin.write(message + '\n');
  });

  ws.on('close', () => {
    // When the WebSocket connection closes, kill the shell process
    shell.kill();
  });

  // Optional: handle shell stdin ending if necessary
  shell.stdin.on('end', () => {
    ws.close();
  });

  // Optional: Handle input/output errors
  // ...

  // Optional: Set up initial shell environment, like changing directory if needed
  // shell.stdin.write('cd some_directory\n');
});

server.listen(3007, () => {
  console.log(`WebSocket Server is running on port ${server.address().port}`);
});
