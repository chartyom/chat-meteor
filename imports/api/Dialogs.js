import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { DialogsCollection as Dialogs, UsersCollection as Users } from '/imports/collections/Collections.js';

if (Meteor.isServer) {

    Meteor.publish('Dialogs.ByUser', function () {
        return Dialogs.find({users: this.userId});
    });

    Meteor.methods({
        'Dialogs.insert'(text, users) {
            check(text, String);
            check(users, [String]);

            //Защита
            //Пользователь авторизован
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            //Создание личного диалога
            if(users[0]!=this.userId){
                //Добавление к списку выбранных пользователей автора
                users.push(this.userId);
            }

            var usersDialog = undefined;
            var dialogId = '';
            const usersLength = users.length;

            if (usersLength === 2) {
                //Чат на 2
                //Защита
                //комната на 2-х
                //в комнате присутствует текущий пользователь users[1]
                //в комнате присутствует собеседник users[0]
                usersDialog = Dialogs.findOne({
                    $and: [
                        {
                            users: {
                                $all: [users[0], users[1]]
                            }
                        }, {users: {$size: 2}}]
                });
            } else if(usersLength === 1) {
                //Чат на 1
                //Защита
                //комната на 1-го
                //в комнате присутствует текущий пользователь users[0]

                usersDialog = Dialogs.findOne({
                    $and: [
                        {
                            users: users[0]
                        }, {users: {$size: 1}}]
                });
            }

            if (usersDialog === undefined) {
                //Диалог не существует
                dialogId = Dialogs.insert({
                    createdAt: new Date(),
                    users: users
                }, function (err, result) {
                    return result;
                });
                usersDialog = {
                    users: users
                }
            } else {
                //Диалог существует
                dialogId = usersDialog._id;
            }

            Meteor.call('DialogsMessages.insert', text, dialogId);

        },
/*
        'rooms.insert'(users) {
            check(users, [String]);

            // Make sure the user is logged in before inserting a task
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            users.push(this.userId);

            /!*Rooms.insert({
             createdAt: new Date(),
             users: users,
             });*!/
        },
        'rooms.remove'(roomId) {
            check(roomId, String);
            //Защита от удаления комнат, которые не принадлежат пользователю
            const room = Rooms.findOne({_id: roomId, users: this.userId});
            if (!room) {
                throw new Meteor.Error('not-authorized');
            }
            /!*Rooms.remove(roomId);*!/
        },
        'rooms.removeMe'(roomId) {
            /!*check(roomId, String);
             //Защита
             const room = Rooms.findOne({_id: roomId, users: this.userId});
             if (!room) {
             throw new Meteor.Error('not-authorized');
             }
             const indexOfUser = room.users.indexOf(this.userId);
             const users = room.users.splice(indexOfUser, 1);
             Rooms.update(roomId, {$set: {users: users}});*!/
        },*/
    });

}