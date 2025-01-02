import chatboxModel from "../models/chatbox.model";
export function Message(socket, io) {
    socket.on('createMessage', async (data) => {
      const result = await chatboxModel.create(data);
      io.emit('messageSent', { result});
    });
    socket.on('getListMessage', async () => {
      const listMessage = await chatboxModel.find();
      socket.emit('ListMessage', listMessage);
    });
  }