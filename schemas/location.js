const mongoose = require("mongoose")
const { Schema } = mongoose;

const locationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Location', locationSchema)