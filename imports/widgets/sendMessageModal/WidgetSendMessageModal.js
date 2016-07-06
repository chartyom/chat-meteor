import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

//import { Rooms } from '../../api/Rooms.js';

import './sendMessageModal.css';
import './WidgetSendMessageModalLayout.html';


Template.WidgetSendMessageModalFormLayout.helpers({
    user() {
        /*
        Session.get("userForSendMessage") =>
        {username: "User", userId: "id"}
        */
        return Session.get("userForSendMessage");
    },
});

Template.WidgetSendMessageModalFormLayout.events({
    'submit .send-message'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.text.value;
        if(text.length === 0){
            throw new Meteor.Error('Введите сообщение');
        }
        const users = Session.get("userForSendMessage");

        // Insert a task into the collection
        //Meteor.call('room-message.insert', text,users);

        $('#sendMessageModal').modal('hide');
        console.log('username: '+users.username+'userId: '+users.userId);
    },
});
