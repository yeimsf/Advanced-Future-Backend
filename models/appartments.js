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
    areaName: {
        type: String,
    },
    description: {
        type: String,
    },
    bathrooms: {
        type: String,
    },
    bedrooms: {
        type: String,
    },
    balconys: {
        type: String,
    },
    kitchens: {
        type: String,
    },
    image: [imageSchema],
    price: {
        type: String,
    }
}, {
    timestamps: true
});
var Appartments = mongoose.model('Appartment', appartSchema);

module.exports = Appartments;
