import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { DialogsCollection as Dialogs, MessagesCollection as Messages} from '/imports/collections/Collections.js';

if (Meteor.isServer) {

    Meteor.publish('DialogsMessages.byDialogId', function (dialogId) {
        //check(roomId, String);
        const dialog = Dialogs.findOne({_id:dialogId,users: this.userId},{fields: {_id:1}});
        if(dialog._id !== undefined){
            return Messages.find({dialogId:dialogId});
        }
    });

    Meteor.publish('DialogsMessages.countDialogsWithNewMessages', function () {

        return Messages.find({
            'views.userId': this.userId,
            'views.view': false
        },{
            fields: {dialogId: 1,'views.userId':1,'views.view': 1}
        });

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
        'DialogsMessages.remove'(messageId) {
            check(messageId, String);
            //Защита от удаления комнат, которые не принадлежат пользователю
            /*const message = Messages.findOne({_id: messageId, userId: this.userId});*/
            if (!message) {
                throw new Meteor.Error('not-authorized');
            }
            /* Messages.remove(messageId);*/
        },
        'DialogsMessages.setView'(dialogId) {
            check(dialogId, String);

            //Защита
            //Пользователь авторизован
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            var users = Dialogs.findOne({
                _id: dialogId, users: this.userId
            }, {
                fields: {_id: 1}
            });

            //Защита
            //В диалоге общаются участники диалога
            if (users._id === undefined) {
                throw new Meteor.Error('not-access');
            }

            Messages.update({
                    dialogId: dialogId,
                    'views.userId': this.userId,
                    'views.view': false
                }, {
                    $set: {
                        'views.$.view': true
                    }
                },
                {multi: true}
            );
        },
    });

}