import app from './app';
import http from 'http';
import nodeConfig from './config/envConfig';

const { port } = nodeConfig;

app.set('port', port); //TODO: WTF?

const server = http.createServer(app);

server.listen(port);

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    console.log('[Error]\n', error);
}

function onListening() {
    console.log(`Server is started on port ${port}`);
}
