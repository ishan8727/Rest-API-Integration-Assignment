const mongoose = require('mongoose');

const weahterSchema = new mongoose.Schema({
    location:{
        name: {type: String, trim: true, require: true},
        region:{type: String, trim: true, require: true},
        country:{type: String, trim: true, require: true}
    },
    current:{
        temp_c: {type: Number},
        condition: {type: String},
        humidity: {type: Number}
    },
    forecast:{
        
    }
})

const weather = mongoose.model('Weahter', weahterSchema);