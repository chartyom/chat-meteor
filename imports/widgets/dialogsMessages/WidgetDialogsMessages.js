import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { MessagesCollection as Messages, UsersCollection as Users  } from '/imports/collections/Collections.js';

import './layouts/WidgetDialogsMessagesLayout.html';

Template.WidgetDialogsMessagesLayout.onCreated(function(){

    import './stylesheet/dialogsMessages.css';

    var self = this;
    self.autorun(function() {
        const dialogId = FlowRouter.getParam('dialogId');
        self.subscribe('DialogsMessages.byDialogId', dialogId);
    });

});

Template.registerHelper("localizedDateAndTime", function(date) {
    if(date)
        return moment(date).format('DD-MM-YYYY, HH:mm');
});

Template.WidgetDialogsMessagesLayout.helpers({
    messages() {
        const dialogId = FlowRouter.getParam('dialogId');
        return Messages.find({dialogId:dialogId},{transform: function (doc) {
            var user = Users.findOne(doc.userId);
            if(user){
                doc.username = user.username;
            }
            return doc;
        }});
    },
    setTitle(title){
        Settings.setNewTitle(title);
    },
});

Template.WidgetDialogsMessagesLayout.events({
    'submit .send-message'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        const dialogId = FlowRouter.getParam('dialogId');
        const target = event.target;
        const text = target.text.value;
        if(text.length === 0) {
            alert('Error Length');
            return false;
        }

        Meteor.call('DialogsMessages.insert', text, dialogId);
        // Clear form
        target.text.value = '';
    },
});


Template.WidgetDialogsMessagesRepeatLayout.helpers({
    isOwner(){
        return this.userId === Meteor.userId();
    },
    isNotOwner(){
        return this.userId !== Meteor.userId();
    }
});