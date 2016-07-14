import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { DialogsCollection as Dialogs, MessagesCollection as Messages} from '/imports/collections/Collections.js';

if (Meteor.isServer) {

    Meteor.publish('DialogsMessages.byDialogId', function (dialogId) {
        //check(roomId, String);
        const dialog = Dialogs.findOne({_id:dialogId,users: this.userId},{fields: {_id:1}});
        if(dialog._id !== undefined){
            var messages = Messages.find({dialogId:dialogId});
/*
            messages.forEach(function(message) {
                message.username = Users.findOne(message.userId).username;
            });*/
            return messages;
        }
    });

    Meteor.methods({
        'DialogsMessages.insert'(text, dialogId) {
            check(text, String);
            check(dialogId, String);

            //Защита
            //Пользователь авторизован
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            var users = Dialogs.findOne({
                _id: dialogId, users: this.userId
            }, {
                fields: {users: 1}
            });

            //Защита
            //В диалоге общаются участники диалога
            if (users.users === undefined) {
                throw new Meteor.Error('not-access');
            }

            const userId = this.userId;
            var columns = [];
            var i = 0;
            /*
             * users => ["id1","id2",...]
             */
            _.each(users.users, function (index, value) {
                if (index != userId) {
                    columns[i] = {
                        userId: index,
                        view: false
                    };
                    i++;
                }
            });

            Messages.insert({
                dialogId: dialogId,
                text: text,
                userId: this.userId,
                createdAt: new Date(),
                views: columns
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