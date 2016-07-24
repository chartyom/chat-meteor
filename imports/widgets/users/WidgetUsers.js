import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { UsersCollection as Users } from '/imports/collections/Collections.js';

import './layouts/WidgetUsersLayout.html';

Template.WidgetUsersLayout.onCreated(function(){
    import './stylesheet/WidgetUsers.css';

    var self = this;
    self.autorun(function() {
        self.subscribe('Users.list',0,10);
    });

});

Template.WidgetUsersLayout.helpers({
    users() {
        return Users.find({});
    },
    usersCount() {
        return Users.find({}).count();
    },
});

/*
 'click .write-message'(event, template) {
 var data = template.find("[data-username]");
 data = $(data).data();
 console.log(data);
 },
*/
Template.WidgetUsersRepeatLayout.helpers({
    isNotOwner() {
        return this._id !== Meteor.userId();
    },
    firstLetterName(username) {
        if (username)
            return username.charAt(0).toUpperCase()
    },
});


Template.WidgetUsersRepeatLayout.events({
    'click .write-message'(event) {
        Session.set("WidgetSendMessageModal", [{userId: this._id, username: this.username}]);
        $('#WidgetSendMessageModal').modal('show');
    },
});

