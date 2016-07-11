import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const Rooms = new Mongo.Collection('rooms');
/*
 Collection rooms
 rooms => {
 _id: id,
 users: [userId1, userId2, ...],
 messages: [
 {_id: id, userId: userId1, text: "Hello", views: [
    {userId: userId1, view: true}, {userId: userId2, view: false}, ...], createAt: date},
 ...,
 ],
 }
 */

if (Meteor.isServer) {

    Meteor.publish('rooms', function roomsPublication() {
        return Rooms.find({users: this.userId}, {"messages.$": 1});
    });

    Meteor.publish('rooms.messages', function roomsMessagesPublication(roomId) {
        //check(roomId, String);
        return Rooms.find({_id: roomId, users: this.userId});
    });

    Meteor.methods({
        'message.insert'(text, roomId, users) {
            check(text, String);
            check(roomId, String);
            check(users, [String]);

            // пользователь авторизован
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            var columns = [];
            var i = 0;

            const userId = this.userId;
            _.each(users, function (index, value) {
                if (index != userId) {
                    columns[i] = {
                        userId: index,
                        view: false
                    };
                }
                i++;
            });

            const ObjectID = new Meteor.Collection.ObjectID();

            Rooms.update({ _id: roomId},
                {
                    $push: {
                        messages: {
                            _id: ObjectID,
                            text: text,
                            userId: this.userId,
                            createdAt: new Date(),
                            views: columns
                        }
                    }
                });
        },
        'room-message.insert'(text, users) {
            check(text, String);
            check(users, [String]);

            // Защита
            // -проверка авторизации пользователя
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            //Добавление к списку выбранных пользователей автора
            users.push(this.userId);

            var usersRoom = '';
            var roomId = 0;
            if (users.length === 2) {
                /*/!*Чат на 2*!/
                /!*Проверка существования диалога*!/*/

                //Защита
                // -комната на 2-х
                // -в комнате присутствует текущий пользователь users[1]
                // -в комнате присутствует собеседник users[0]
                usersRoom = Rooms.findOne({
                    $and: [
                        {
                            users: {
                                $all: [users[0], users[1]]
                            }
                        }, {users: {$size: 2}}]
                });
            }

            if (!usersRoom) {
                //Комната не существует
                roomId = Rooms.insert({
                    createdAt: new Date(),
                    users: users
                }, function (err, result) {
                    return result;
                });
                usersRoom = {
                    users: users
                }
            } else {
                //Комната существует
                roomId = usersRoom._id;
            }

            var columns = {};
            var i = 0;
            $.each(usersRoom.users, function (index, value) {
                if (value != this.userId) {
                    columns[i] = {
                        userId: value,
                        view: false
                    };
                }
                i++;
            });

             /*Messages.insert({
             roomId: roomId,
             text: text,
             userId: this.userId,
             createdAt: new Date(),
             views: columns,
             });*/
        },
        'message.remove'(messageId) {
            check(messageId, String);
            //Защита от удаления комнат, которые не принадлежат пользователю
            /*const message = Messages.findOne({_id: messageId, userId: this.userId});*/
            if (!message) {
                throw new Meteor.Error('not-authorized');
            }
            /* Messages.remove(messageId);*/
        },
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
            Rooms.update(roomId, { $set: { users: users } });
        },
    });

}