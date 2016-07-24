import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { DialogsCollection as Dialogs, UsersCollection as Users } from '/imports/collections/Collections.js';


import './layouts/WidgetDialogsLayout.html';

Template.WidgetDialogsLayout.onCreated(function () {
    import './stylesheet/WidgetDialogs.css';

    var self = this;
    self.autorun(function () {
        self.subscribe('Users.all');
        self.subscribe('Dialogs.ByUser');
    });

});

Template.WidgetDialogsLayout.onRendered(function () {

});


Template.WidgetDialogsLayout.helpers({
    dialogs() {
        return Dialogs.find({}, {
            fields: {
                _id: 1,
                users: 1
            }, transform: function (doc) {

                /*
                 * Если в диалоге присутствует id второго пользователя и id
                 * первого пользователя равно текущему пользвателю:
                 * то выбираем id второго пользователя,
                 * иначе id первого
                 */
                var user = (doc.users[1] && doc.users[0] === Meteor.userId()) ? doc.users[1] : doc.users[0];

                user = Users.findOne({_id: user});
                if (user) {
                    doc.username = user.username;
                }
                return doc;
            }
        });
    },
    /*dialogsCount() {
        return Dialogs.find({}).count();
    },*/
});

Template.WidgetDialogsRepeatLayout.helpers({
    firstLetterName(username) {
        if (username)
            return username.charAt(0).toUpperCase()
    },
});