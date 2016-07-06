import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Rooms = new Mongo.Collection('rooms');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('rooms', function (){
        return Rooms.find({users: this.userId});
    });

    Meteor.methods({
        'rooms.insert'(users) {
            check(users, [String]);

            // Make sure the user is logged in before inserting a task
            if (! this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            users.push(this.userId);

            Rooms.insert({
                createdAt: new Date(),
                users: users,
            });
        },
        'rooms.remove'(roomId) {
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