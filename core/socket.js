const socket = require ('socket.io')



 function createSocket (http) {

    const io = socket(http);

    io.on('connection', function(socket) {
        // socket.on('DIALOGS:JOIN', (dialogId: string) => {
        //     socket.dialogId = dialogId;
        //     socket.join(dialogId);
        // });
        // socket.on('DIALOGS:TYPING', (obj: any) => {
        //     socket.broadcast.emit('DIALOGS:TYPING', obj);
        // });
       // console.log(socket.handshake.query.token)
        console.log("Пользователь/ комната",  socket.id, socket.handshake.query.idUser)
        socket.join(socket.handshake.query.idUser);



    });

    return io;
};

module.exports = createSocket