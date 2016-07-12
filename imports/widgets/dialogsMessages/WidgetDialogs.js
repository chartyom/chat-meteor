import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { DialogsCollection as Dialogs } from '/imports/collections/DialogsCollection.js';
import {Settings} from '/imports/startup/config.js';

import './layouts/WidgetDialogsLayout.html';

Template.WidgetDialogsLayout.onCreated(function(){

    import './stylesheet/dialogs.css';

    Meteor.subscribe('dialogs.list');

    Settings.setNewTitle("Мои Диалоги");
});

Template.WidgetDialogsLayout.helpers({
    dialogs() {
        return Dialogs.find({},{fields:{
            _id: 1,
            users: 1
        }});
    },
    dialogsCount() {
        return Dialogs.find({}).count();
    },
});