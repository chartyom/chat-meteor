import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { MessagesCollection as Messages, UsersCollection as Users  } from '/imports/collections/Collections.js';
import {Page} from '/imports/lib/PageEditor.js'

/*
 * 1.Привязка автоскролла к элементам
 * .widget-dsmsl__scroll--not-read
 * .widget-dsmsl__scroll--bottom
 *
 * 2.Временные переменные, для эффекта прочтения сообщений
 *
 */
var WidgetDialogsOptions = {
    peggingOnBottom: true,
    peggingOnNotRead: true,
    timers: {
        timer1: null,
        timer2: null
    }
};

import './layouts/WidgetDialogsMessagesLayout.html';

Template.WidgetDialogsMessagesLayout.onCreated(function(){

    import './stylesheet/WidgetDialogsMessages.css';

    var self = this;
    self.autorun(function() {
        const dialogId = FlowRouter.getParam('dialogId');
        self.subscribe('DialogsMessages.byDialogId', dialogId);

        /*Обнуление привязки при переключении на новую страницу*/
        WidgetDialogsOptions.peggingOnBottom = true;
        WidgetDialogsOptions.peggingOnNotRead = true;

    });

    $('body').addClass('widgetDialogsMessages');
});

Template.WidgetDialogsMessagesLayout.onDestroyed(function(){
    $('body').removeClass('widgetDialogsMessages');
});

Template.WidgetDialogsMessagesLayout.helpers({
    messages() {

        const dialogId = FlowRouter.getParam('dialogId');
        var query = Messages.find({dialogId:dialogId},{sort: {createdAt: 1},transform: function (doc) {
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
        Page.setNewTitle(title);
    },
});

Template.WidgetDialogsMessagesFormLayout.events({
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

        WidgetDialogsOptions.peggingOnBottom = true;
        // Clear form
        target.text.value = '';
        target.text.focus();
    },
    'keyup .send-message'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        if (event.keyCode === 13) {
            const dialogId = FlowRouter.getParam('dialogId');
            const target = event.target;
            const text = target.value;
            if(text.length === 0) {
                alert('Error Length');
                return false;
            }
            Meteor.call('DialogsMessages.insert', text, dialogId);

            WidgetDialogsOptions.peggingOnBottom = true;
            target.value = '';
            target.focus();
        }

    }
});



Template.WidgetDialogsMessagesRepeatLayout.onRendered(function() {
    /*Привязка к непрочитанным сообщениям*/
    var scroll_el_1 = $('.widget-dsmsl__scroll--not-read');
    if (scroll_el_1.length > 4) { // проверим существование элемента чтобы избежать ошибки
        $(window).scrollTop((scroll_el_1).offset().top - 80);
        WidgetDialogsOptions.peggingOnNotRead=true;
    } else {
        WidgetDialogsOptions.peggingOnNotRead=false;
    }

    if(!WidgetDialogsOptions.peggingOnNotRead){
        /*Привязка к нижней части страницы*/
        $(window).scroll(function(){
            var scrollTop = $(window).scrollTop();
            var scrollBottom = scrollTop + $(window).height();
            var heightPage = $(document).height();
            WidgetDialogsOptions.peggingOnBottom = (scrollBottom===heightPage);
        });

        if(WidgetDialogsOptions.peggingOnBottom){
            Page.scrollToElement($('.widget-dsmsl__scroll--bottom'));
        }
    }

});

Template.WidgetDialogsMessagesRepeatLayout.helpers({
    isOwner(){
        return this.userId === Meteor.userId();
    },
    isNotOwner(){
        return this.userId !== Meteor.userId();
    },
    setView(){
        Meteor.clearTimeout(WidgetDialogsOptions.timers.timer2);
        Meteor.clearTimeout(WidgetDialogsOptions.timers.timer1);
        WidgetDialogsOptions.timers.timer1 = Meteor.setTimeout(function(){
            $('.widget-dsmsl__list__item--other')
                .removeClass('widget-dsmsl__item--not-read');
            WidgetDialogsOptions.timers.timer2 = Meteor.setTimeout(function(){
                const dialogId = FlowRouter.getParam('dialogId');
                Meteor.call('DialogsMessages.setView',dialogId);
                console.log('I watched');
            }, 500);
        }, 1500);
    },
    firstLetterName(username) {
        if(username)
            return username.charAt(0).toUpperCase()
    },
    checkRead(obj){
        if (obj) {
            var result = false;
            $.map(obj, function (value, index) {
                if (value && value.userId && (value.view === true || value.view === false)) {
                    if (value.userId === Meteor.userId) {
                        if (value.view === true) {
                            return false;
                        }
                    } else {
                        if (value.view !== true) {
                            result = true;
                        }
                    }
                }
            });
        }
        return result;
    },
    messageDateAndTime(date){
        if(date)
            return moment(date).format('DD.MM.YYYY, HH:mm');
    }
});
