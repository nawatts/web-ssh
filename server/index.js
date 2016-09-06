const SSHClient = require('ssh2').Client;

module.exports = (connectCallback) => (ws) => {
  const conn = new SSHClient();

  ws.on('close', () => {
    console.log('socket closed');
    conn.end();
  });

  conn.on('ready', () => {
    console.log('Connection ready');

    conn.shell((err, stream) => {
      if (err) {
        throw err;
      }

      ws.send('s:connected');

      stream.on('close', (code, signal) => {
        console.log(`Stream closed. Code = ${code}, signal = ${signal}`);
        conn.end();
        ws.close();
      }).on('data', (data) => {
        console.log(`STDOUT: ${data.toString()}`);
        ws.send(`o:${data.toString()}`);
      }).stderr.on('data', (data) => {
        console.log(`STDERR: ${data.toString()}`);
        ws.send(`o:${data.toString()}`);
      });

      ws.on('message', (payload) => {
        console.log(payload);
        try {
          const msg = JSON.parse(payload);
          if ('i' in msg) {
            console.log(`INPUT: ${msg}`);
            stream.write(msg.i);
          } else if ('r' in msg) {
            console.log(`RESIZE: ${msg.r.w} x ${msg.r.h} px, ${msg.r.c} cols x ${msg.r.r} rows`);
            stream.setWindow(msg.r.r, msg.r.c, msg.r.h, msg.r.w);
          }
        } catch (e) {
          console.log('Failed to parse message');
          console.log(e);
        }
      });
    });
  }).connect(connectCallback(ws));
};
