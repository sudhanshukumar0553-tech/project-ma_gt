import http from 'http';
import express from 'express';

const app = express();
app.get('/', (req, res) => res.send('hi'));

const server = app.listen(5000, () => {
    console.log('Test server listening on 5000');
});

server.on('error', (e) => console.error('Error:', e));
