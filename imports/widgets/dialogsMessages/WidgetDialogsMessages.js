import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { DialogsCollection as Dialogs} from '/imports/collections/DialogsCollection.js';
import { MessagesCollection as Messages} from '/imports/collections/MessagesCollection.js';
import {Settings} from '/imports/startup/config.js';

import './layouts/WidgetDialogsMessagesLayout.html';

Template.WidgetDialogsMessagesLayout.onCreated(function(){

    import './stylesheet/dialogsMessages.css';

    this.getDialogId = () => FlowRouter.getParam('dialogId');

    Meteor.subscribe('dialogs-messages.list', FlowRouter.getParam('dialogId'));


    Settings.setNewTitle("Мои сообщения");
});

Template.WidgetDialogsMessagesLayout.helpers({
    messages() {
        const instance = Template.instance();
        const dialogId = instance.getDialogId();
        return Messages.find({dialogId:dialogId});
    },
    setTitle(title){
        Settings.setNewTitle(title);
    }
});

Template.WidgetDialogsMessagesLayout.events({
    'submit .send-message'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        const instance = Template.instance();
        const dialogId = instance.getDialogId();

        const target = event.target;
        const text = target.text.value;
        if(text.length === 0) {
            alert('Error Length');
            return false;
        }

        Meteor.call('dialogs-messages.insert', text, dialogId);

        // Clear form
        target.text.value = '';
    },
});
