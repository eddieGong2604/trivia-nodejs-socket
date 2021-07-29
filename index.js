const express = require('express');
const mongoose = require('mongoose');
const socket = require("socket.io");
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes')
const User = require("./models/User");
const {getAllUsers} = require("./utils/users");
const {getCurrentUser} = require("./utils/users");
const {getRoomUsers, userJoin, userLeave} = require("./utils/users");

const app = express();
app.use(express.static(path.join(__dirname, 'client/build')));

// middleware
app.use(cors())
app.use(express.json());

// database connection
const dbURI = 'mongodb+srv://admin:admin@cluster0.walo0.mongodb.net/node-auth?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => {
    })
    .catch((err) => console.log(err));


const db = mongoose.connection;


app.use(userRoutes);

const port = (process.env.PORT || 8080);


const server = app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

// Socket setup
const io = socket(server, {
    cors: {
        origin: `http://localhost:${port}`,
        methods: ["GET", "POST"],
    }
});

io.on("connection", function (socket) {
    db.once('open', () => {
        const userCollection = db.collection('users');
        const changeStream = userCollection.watch();
        changeStream.on('change', (change) => {
            if (change.operationType == 'update') {
                User.find({}).sort({points: -1}).limit(5).exec(function (err, users) {
                    if (!err) {
                        socket.emit('update-leaderboard', users);
                    }
                });
            }
        });
    });

    socket.emit("get-all-rooms", getActiveRooms(io));

    socket.on('get-leaderboard-request', () => {
        User.find({}).sort({points: -1}).limit(5).exec(function (err, users) {
            if (!err) {
                io.emit('update-leaderboard', users);
            }
        });
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user && user.room) {
            io.to(user.room).emit('room-users', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        io.emit("get-all-rooms", getActiveRooms(io));
    });

    socket.on('leave-room', () => {
        const user = userLeave(socket.id);
        if (user && user.room) {
            socket.leave(user.room);

            io.emit("get-all-rooms", getActiveRooms(io));
            socket.broadcast.to(user.room).emit('update-leave-room', {
                user: user.username,
            });
        }
    })

    socket.on('client-create-room', ({roomName, username}) => {
        userJoin(socket.id, username, roomName);
        socket.join(roomName);

        io.emit("get-all-rooms", getActiveRooms(io));
    });

    socket.on('get-all-rooms-request', () => {
        socket.emit("get-all-rooms", getActiveRooms(io));
    });


    socket.on('client-leave-room', (room) => {
        userLeave(socket.id);
        socket.leave(room);
        io.emit("get-all-rooms", getActiveRooms(io));
    });

    socket.on('get-ready', (isReady) => {
        const user = getCurrentUser(socket.id);
        socket.broadcast.to(user.room).emit('room-readiness', {
            user: user.username,
            isReady
        });
    })

    socket.on('update-score', ({username, addedScore, room}) => {
        socket.broadcast.to(room).emit('get-score', {
            user: username,
            addedScore
        });
    })

    socket.on('finish-attempt', (isFinished) => {
        const user = getCurrentUser(socket.id);
        socket.broadcast.to(user.room).emit('get-finished', {
            user: user.username,
            isFinished
        });
        io.sockets.adapter.rooms.get(user.room).forEach(id => {
            io.sockets.sockets.get(id).leave(user.room);
        });
    })

    socket.on('join-room', async ({room, username}) => {
        if (io.sockets.adapter.rooms.get(room) && io.sockets.adapter.rooms.get(room).size >= 2) {
            return;
        }
        if (getCurrentUser(socket.id) && getAllUsers().find(user => user.username === getCurrentUser(socket.id).username)) {
            return;
        }
        const user = userJoin(socket.id, username, room);
        socket.join(room);
        io.to(user.room).emit('room-users', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        io.emit("get-all-rooms", getActiveRooms(io));
    });
});

const getActiveRooms = (io) => {
    // Convert map into 2D list:
    // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
    const arr = Array.from(io.sockets.adapter.rooms);
    // Filter rooms whose name exist in set:
    // ==> [['room1', Set(2)], ['room2', Set(2)]]
    const filtered = arr.filter(room => !room[1].has(room[0]))
    // Return only the room name:
    // ==> ['room1', 'room2']
    let res = filtered.map(i => i[0]).map(i => ({
                roomName: i,
                numberOfUser: io.sockets.adapter.rooms.get(i).size, isFull: io.sockets.adapter.rooms.get(i).size >= 2,
                currentUsers: getRoomUsers(i)
            }
        )
    );
    return res;
};


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

