import { Mongo } from 'meteor/mongo';

export const DialogsCollection = new Mongo.Collection('dialogs');

/*
 Collection dialogs
 dialogs => {
 _id: id,
 createdAt: new Date()
 users: [userId1, userId2, ...],
 }
 */