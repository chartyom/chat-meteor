import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
//import { ReactiveDict } from 'meteor/reactive-dict';

import { Rooms } from '../../api/Rooms.js';

import './rooms.css';
import './WidgetRoomsLayout.html';

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