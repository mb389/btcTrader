var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    event_date: {
      type: Date,
      required: true
    },
    country: {
      type: String
    },
    event_name: {
      type: String
    }
});


mongoose.model('Events', schema);
