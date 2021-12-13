const { DateTime } = require("luxon");
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');

let stories;//instance of the collection class
exports.initCollection = (db) => {
    stories = db.collection('stories');
}

// db.collection.find
exports.find = () => stories.find().toArray();

exports.findById = id => stories.findOne({ _id: ObjectId(id) });

exports.save = (story) => stories.insertOne(story);

exports.updateById = (id, newStory) => stories.findOneAndUpdate({ _id: ObjectId(id) },
    { $set: { title: newStory.title, content: newStory.content } });



exports.deleteById = (id) => stories.deleteOne({ _id: ObjectId(id) });
