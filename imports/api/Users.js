import { UsersCollection as Users } from '/imports/collections/Collections.js';
import { Match } from 'meteor/check';

if (Meteor.isServer) {
    Meteor.publish('Users.all', function (){
        return Users.find({},{fields:{_id:1,username:1,profile:1}});
    });

    Meteor.publish('Users.list', function (skip,limit){
        if ( Match.test(skip, Match.Integer) && Match.test(limit, Match.Integer) ) {
            return Users.find({}, {fields: {_id: 1, username: 1, profile: 1}, limit: limit, skip: skip});
        }
    });

    Meteor.publish('Users.byUserId', function (userId){
        if ( Match.test(userId, String) ) {
            return Users.find({_id: userId},{fields:{_id:1,username:1,profile:1},limit:1});
        }
    });

    Meteor.methods({});
}