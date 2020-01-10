import app from './app';
import * as http from 'http';
import * as dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || '3030';

app.set('port', port);

const server = http.createServer(app);

server.listen(port);

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    console.log('[Error]\n', error);
}

function onListening() {
    console.log(`Server is started on port 33 ${port}`);
}
