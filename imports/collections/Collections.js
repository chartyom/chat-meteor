import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const DialogsCollection = new Mongo.Collection('dialogs');

/*
 Collection dialogs
 dialogs => {
 _id: id,
 createdAt: new Date()
 users: [userId1, userId2, ...],
 }
 */

export const MessagesCollection = new Mongo.Collection('dialogs-messages');
/*
 Collection messages
 messages => {
 _id: id,
 dialogId: id,
 userId: userId1,
 text: "Hello",
 views: [
 {userId: userId1,view: true},
 {userId: userId2, view: false},
 ...],
 createAt: date
 }
 */

export const UsersCollection = Meteor.users;

/*
 Collection users
 dialogs => {
 _id: id,
 createdAt: new Date()
 users: [userId1, userId2, ...],
 }
 */

export const TasksCollection = new Mongo.Collection('tasks');