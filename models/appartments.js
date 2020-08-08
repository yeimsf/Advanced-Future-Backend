const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var imageSchema = new Schema({
  image:{
      type: String,
      required: true
  }
})

var appartSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    image: [imageSchema],
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
var Appartments = mongoose.model('Appartment', appartSchema);

module.exports = Appartments;
