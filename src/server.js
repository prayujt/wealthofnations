const path = require('path')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://47.204.224.76:2000',
        //origin: 'http://192.168.86.29:2000',
        methods: ['GET', 'POST']
    }    
})
const port = 8000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

io.on('connection', socket => {
    console.error('socket.io connection')
    for (var t = 0; t < 3; t++)
        setTimeout(() => socket.emit('message', 'message from server'), 1000 * t)
})

http.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})
