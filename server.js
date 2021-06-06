const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = require('socket.io')(server);


io.on('connection', function(socket) {
    // console.log(socket);
    // socket.emit('news', { hello: 'world' });
});

exports.emitData = function(data, name) {
    io.emit('data', { data: data, name: name });
}

server.listen(port, () => {
    console.log(`Server is running on Port ${port}`)
});