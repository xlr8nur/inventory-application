const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {type: String, required: true, minLength: 1, maxLength: 32},
    description: {type: String, required: true, minLength: 1, maxLength: 450},
    items: [{type: Schema.ObjectedId, ref: 'Part'}]
});

CategorySchema.virtual('url').get(function() {
    return `/category/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);