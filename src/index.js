const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')

const app=express()
const server=http.createServer(app)
const io=socketio(server)   //socket io expects to be called with raw http server hence we refactored


const port=process.env.PORT||3000

const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

let welcomeMessage=`Welcome to the chatting app`

io.on('connection',(socket)=>{
    console.log('New websocket connection')

    socket.on('join',({username,room},callback)=>{
        const {error,user}=addUser({id:socket.id,username,room})

        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('Message',generateMessage('Admin',welcomeMessage))

        socket.broadcast.to(user.room).emit('Message',generateMessage('Admin',`${user.username} has joined`))

        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        callback()
           
    })

    socket.on('sendMessage',(message,callback)=>{
        const {username,room}=getUser(socket.id)
        io.to(room).emit('Message',generateMessage(username,message))
        callback()
    })


    socket.on('sendLocation',(pos,callback)=>{
        const {username,room}=getUser(socket.id)
        io.to(room).emit('locationMessage',generateLocationMessage(username,`https://google.com/maps?q=${pos.latitude},${pos.longitude}`))
        callback()
    })


    socket.on('disconnect',()=>{
        
        
        const user=removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('Message',generateMessage('Admin',`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
        
    })

    
})

server.listen(port,()=>{
    console.log(`Server is up on port ${port} `)
    
})