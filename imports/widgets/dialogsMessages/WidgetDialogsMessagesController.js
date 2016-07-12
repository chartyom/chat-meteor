import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { DialogsCollection as Dialogs } from '/imports/collections/DialogsCollection.js';
import { MessagesCollection as Messages} from '/imports/collections/MessagesCollection.js';

if (Meteor.isServer) {

    Meteor.publish('dialogs.list', function () {
        return Dialogs.find({users: this.userId});
    });

    Meteor.publish('dialogs-messages.list', function (dialogId) {
        //check(roomId, String);
        return Messages.find({dialogId: dialogId});
    });

    Meteor.methods({
        'dialogs-messages.insert'(text, dialogId) {
            check(text, String);
            check(dialogId, String);

            // пользователь авторизован
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            var columns = [];
            var i = 0;
            var users = Dialogs.findOne(dialogId).users;
            const userId = this.userId;
            /*
             * users => ["id1","id2",...]
             */
            _.each(users, function (index, value) {
                if (index != userId) {
                    columns[i] = {
                        userId: index,
                        view: false
                    };
                }
                i++;
            });

            Messages.insert({
                    dialogId: dialogId,
                    text: text,
                    userId: this.userId,
                    createdAt: new Date(),
                    views: columns
                });
        },
        'dialogs.insert'(text, users) {
            check(text, String);
            check(users, [String]);

            // Защита
            // -проверка авторизации пользователя
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            //Добавление к списку выбранных пользователей автора
            users.push(this.userId);

            var usersDialog = '';
            var dialogId = '';

            if (users.length === 2) {
                /*/!*Чат на 2*!/
                 /!*Проверка существования диалога*!/*/

                //Защита
                // -комната на 2-х
                // -в комнате присутствует текущий пользователь users[1]
                // -в комнате присутствует собеседник users[0]
                usersDialog = Dialogs.findOne({
                    $and: [
                        {
                            users: {
                                $all: [users[0], users[1]]
                            }
                        }, {users: {$size: 2}}]
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

            var columns = [];
            var i = 0;
            const userId = this.userId;

            /*
            * usersDialog.users => ["id1","id2",...]
            */
            _.each(usersDialog.users, function (index, value) {
                if (index != userId) {
                    columns[i] = {
                        userId: index,
                        view: false
                    };
                }
                i++;
            });

            Messages.insert({
                dialogId: dialogId,
                text: text,
                userId: this.userId,
                createdAt: new Date(),
                views: columns,
            });
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
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            users.push(this.userId);

            /*Rooms.insert({
                createdAt: new Date(),
                users: users,
            });*/
        },
        'rooms.remove'(roomId) {
            check(roomId, String);
            //Защита от удаления комнат, которые не принадлежат пользователю
            const room = Rooms.findOne({_id: roomId, users: this.userId});
            if (!room) {
                throw new Meteor.Error('not-authorized');
            }
            /*Rooms.remove(roomId);*/
        },
        'rooms.removeMe'(roomId) {
            /*check(roomId, String);
            //Защита
            const room = Rooms.findOne({_id: roomId, users: this.userId});
            if (!room) {
                throw new Meteor.Error('not-authorized');
            }
            const indexOfUser = room.users.indexOf(this.userId);
            const users = room.users.splice(indexOfUser, 1);
            Rooms.update(roomId, {$set: {users: users}});*/
        },
    });

}