import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict'

import { Rooms } from './WidgetRoomsMessagesController.js';

import './stylesheet/roomsMessages.css';
import './layouts/WidgetRoomsMessagesLayout.html';

Template.WidgetRoomsMessagesLayout.onCreated(function(){
    Meteor.subscribe('rooms.messages', FlowRouter.getParam('roomId'));
    this.space = new ReactiveDict();
    const getRoomId = FlowRouter.getParam('roomId');
    const room = Rooms.find({_id:getRoomId}).map( function(u) { return u.users; } );
    console.log(room.users);
    Template.instance().space.set({
        usersInRoom: room,
        getRoomId: getRoomId
    });
    console.log("onCreated");
});

Template.WidgetRoomsMessagesLayout.onRendered(function(){
    console.log("onRendered");
});

Template.WidgetRoomsMessagesLayout.onDestroyed(function () {
    console.log("onDestroyed");
});

Template.WidgetRoomsMessagesLayout.helpers({
    room() {
        return Rooms.findOne(FlowRouter.getParam('roomId'),{messages: 1});
    }
});

Template.WidgetRoomsMessagesLayout.events({
    'submit .send-message'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        const getRoomId = FlowRouter.getParam('roomId');
        const target = event.target;
        const text = target.text.value;
        if(text.length == 0) {
            console.log('error');
            return false;
        }

       /* const users = [ "zEPqvEBGg4oSRtqYu", "v5jPzYRb25ocwTmKd" ];*/
        var users = this.usersArray();
        var roomId = Template.instance().space.get('getRoomId');
        console.log(users);
        //Meteor.call('message.insert', text, roomId, users);

        // Clear form
        target.text.value = '';
    },
});

import './stylesheet/rooms.css';
import './layouts/WidgetRoomsLayout.html';

Template.WidgetRoomsLayout.onCreated(function(){
    Meteor.subscribe('rooms');
});

Template.WidgetRoomsLayout.helpers({
    rooms() {
        return Rooms.find({});
    },
    roomsCount() {
        return Rooms.find({}).count();
    },
});