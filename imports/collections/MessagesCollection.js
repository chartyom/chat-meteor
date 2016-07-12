import { Mongo } from 'meteor/mongo';

export const MessagesCollection = new Mongo.Collection('dialogs-messages');
/*
 Collection messages
 messages => {
  _id: id,
  dialogId: id,
  userId: userId1,
  text: "Hello",
  views: [
    {userId: userId1,view: true},
    {userId: userId2, view: false},
    ...],
  createAt: date
 }
 */
