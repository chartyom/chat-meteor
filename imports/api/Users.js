import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


export const Users = Meteor.users;

if (Meteor.isServer) {
    Meteor.publish('users', function (){
        return Users.find({},{_id:1,username:1,profile:1});
    });
}