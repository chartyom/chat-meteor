import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { MessagesCollection as Messages, UsersCollection as Users  } from '/imports/collections/Collections.js';

import './layouts/WidgetDialogsMessagesLayout.html';

Template.WidgetDialogsMessagesLayout.onCreated(function(){

    import './stylesheet/WidgetDialogsMessages.css';

    var self = this;
    self.autorun(function() {
        const dialogId = FlowRouter.getParam('dialogId');
        self.subscribe('DialogsMessages.byDialogId', dialogId);
    });

    $('body').addClass('widgetDialogsMessages');
});

Template.WidgetDialogsMessagesLayout.onDestroyed(function(){
    $('body').removeClass('widgetDialogsMessages');
});

Template.registerHelper("WidgetDialogsMessagesCheckRead", function(obj) {
    if(obj){
        var result = false;
        $.map(obj, function(value, index) {
            console.log(value);
            if(value && value.userId && (value.view === true || value.view === false) ) {
                console.log(value.userId + ' ' + value.view);
                if(value.userId === Meteor.userId){
                    if(value.view === true) {
                        return false;
                    }
                } else {
                    if(value.view !== true) {
                        result = true;
                    }
                }
            }
        });
    }
    return result;
});

Template.registerHelper("WidgetDialogsMessagesDateAndTime", function(date) {
    if(date)
        return moment(date).format('DD.MM.YYYY, HH:mm');
});

Template.registerHelper("WidgetDialogsMessagesFirstLetterName", function(username) {
    if(username)
        return username.charAt(0).toUpperCase()
});

Template.WidgetDialogsMessagesLayout.helpers({
    messages() {

        const dialogId = FlowRouter.getParam('dialogId');
        var query = Messages.find({dialogId:dialogId},{transform: function (doc) {
            var user = Users.findOne(doc.userId);
            if(user){
                doc.username = user.username;
            }
            return doc;
        }});

        var pegging = false;

        var handle = query.observeChanges({
            added: function(doc){

            }
        });

        return query;
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


Template.WidgetDialogsMessagesRepeatLayout.onRendered(function() {

    var scrollTop = $(window).scrollTop();
    var heightPage = $(document).height();

    var scroll_el_1 = $('.widget-dsmsl__scroll--not-read');
    var scroll_el_2 = $('.widget-dsmsl__scroll--bottom');
    if (scroll_el_1.length != 0) { // проверим существование элемента чтобы избежать ошибки
        $(window).scrollTop((scroll_el_1).offset().top - 80);
    } else if (scroll_el_2.length != 0){
        $(window).scrollTop((scroll_el_2).offset().top);
    }
/*

     var scrollTop = $(window).scrollTop();

     var heightCondition = $(document).height() - $(window).height();

     if(scrollTop >= heightCondition){
        $(window).scrollTop(heightCondition);
     }
     console.log('pegging true sb=' + scrollTop + ' hc=' + heightCondition);
*/

    /*console.log('Complete: scroll at the bottom');*/

});

Template.WidgetDialogsMessagesRepeatLayout.helpers({
    isOwner(){
        return this.userId === Meteor.userId();
    },
    isNotOwner(){
        return this.userId !== Meteor.userId();
    }
});