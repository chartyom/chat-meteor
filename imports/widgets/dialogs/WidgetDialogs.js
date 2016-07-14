import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { DialogsCollection as Dialogs, UsersCollection as Users } from '/imports/collections/Collections.js';


import './layouts/WidgetDialogsLayout.html';

Template.WidgetDialogsLayout.onCreated(function(){
    import './stylesheet/dialogs.css';

    var self = this;
    self.autorun(function() {
        self.subscribe('Users.all');
        self.subscribe('Dialogs.ByUser');
    });
    console.log("onCreated");
});

Template.WidgetDialogsLayout.onRendered(function(){

});

Template.WidgetDialogsLayout.helpers({
    dialogs() {
        return Dialogs.find({},{fields:{
            _id: 1,
            users: 1
        },transform: function (doc) {
            var user = Users.findOne({_id:doc.users[0]});
            if(user){
                doc.username = user.username;
            }
            return doc;
        }});
    },
    dialogsCount() {
        return Dialogs.find({}).count();
    },
});