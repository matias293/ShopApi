let io

module.exports = {
    init : htppServer => {
        io = require('socket.io')(htppServer,{
              cors: {
                  origin: "http://localhost:3000",
                  methods: ["GET", "POST"]
              }
        })
        return io
    },
              getIO : () =>  {
                  if(!io){
                      throw new Error('Socket.io no initial')
                  }
                  return io
              }
          
    
}