import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { MessagesCollection as Messages } from '/imports/collections/Collections.js';
import { ReactiveDict } from 'meteor/reactive-dict'

var myAudio = new Sound('/sounds/notify.mp3', 1, false, false);

import './HeaderNavbarMainThemeLayout.html';
import './navbar-main-theme.css';

Template.HeaderNavbarMainThemeLayout.onCreated(function(){
    Meteor.subscribe('DialogsMessages.countDialogsWithNewMessages');
});

Template.HeaderNavbarMainThemeLayout.helpers({
    MessagesNotRead() {
        var messagesNotRead = Messages.find({
            'views.userId': Meteor.userId(),
            'views.view': false
        });

        messagesNotRead = messagesNotRead.fetch();

        var sort = {};
        var sortLength = 0;
        messagesNotRead.map( function (a) {
            if (a.dialogId in sort)
                sort[a.dialogId] ++;
            else {
                sortLength ++;
                sort[a.dialogId] = 1;
                myAudio.play();
                console.log("new message.");
            }
        });

        return sortLength;
    },
});

Template.HeaderNavbarMainThemeLayout.events({

});
