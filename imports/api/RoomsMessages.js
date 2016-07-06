import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Messages = new Mongo.Collection('rooms-messages');
export const Rooms = new Mongo.Collection('rooms');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('rooms-messages', function (){
        return Messages.find({_id: FlowRouter.getParam('_id'),users: this.userId}, { sort: { createdAt: -1 } });
    });

    Meteor.methods({
        'message.insert'(text,roomId) {
            check(text, String);
            check(roomId, String);

            //Защита
            // -получения списка пользователей конкретной комнаты
            // -в комнате существует текущий пользователь
            const usersRoom = Rooms.findOne({_id: roomId, users: this.userId});
            if (!usersRoom) {
                throw new Meteor.Error('not-authorized');
            }
            // пользователь авторизован
            if (! this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            var columns = {};
            var i = 0;
            $.each(usersRoom.users, function( index, value ) {
                if(value != this.userId){
                    columns[i] = {
                        userId : value,
                        view : false
                    };
                }
                i++;
            });

            Messages.insert({
                roomId: roomId,
                text: text,
                userId: this.userId,
                createdAt: new Date(),
                views: columns,
            });
        },
        'room-message.insert'(text) {
            check(text, String);

            //Защита
            // -получения списка пользователей конкретной комнаты
            // -в комнате существует текущий пользователь
            const usersRoom = Rooms.findOne({_id: roomId, users: this.userId});
            if (!usersRoom) {
                throw new Meteor.Error('not-authorized');
            }
            // пользователь авторизован
            if (! this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            var columns = {};
            var i = 0;
            $.each(usersRoom.users, function( index, value ) {
                if(value != this.userId){
                    columns[i] = {
                        userId : value,
                        view : false
                    };
                }
                i++;
            });

            Messages.insert({
                roomId: roomId,
                text: text,
                userId: this.userId,
                createdAt: new Date(),
                views: columns,
            });
        },
        'message.remove'(roomId) {
            check(roomId, String);
            //Защита от удаления комнат, которые не принадлежат пользователю
            const room = Rooms.findOne({_id: roomId, users: this.userId});
            if (!room) {
                throw new Meteor.Error('not-authorized');
            }
            Rooms.remove(roomId);
        },
        'rooms.removeMe'(roomId) {
            check(roomId, String);
            //Защита
            const room = Rooms.findOne({_id: roomId, users: this.userId});
            if (!room) {
                throw new Meteor.Error('not-authorized');
            }
            const indexOfUser = room.users.indexOf(this.userId);
            const users = room.users.splice(indexOfUser, 1);
            Room.update(roomId, { $set: { users: users } });
        },
    });

}