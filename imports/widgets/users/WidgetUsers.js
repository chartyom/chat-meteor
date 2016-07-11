import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
/*import { ReactiveDict } from 'meteor/reactive-dict';*/

import { Users } from '../../api/Users.js';

import './users.css';
import './WidgetUsersLayout.html';

Template.WidgetUsersLayout.onCreated(function(){
    Meteor.subscribe('users');
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
});

Template.WidgetUsersRepeatLayout.events({
    'click .write-message'(event) {
        Session.set("userForSendMessage", {
            userId: this._id,
            username: this.username
        });
        $('#sendMessageModal').modal('show');
    },
});