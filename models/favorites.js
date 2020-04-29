const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);


const favdishSchema = new Schema ({
    dishId :{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Dish'
    }
},{
    timestamps: true
});

const favoriteSchema = new Schema({
    author :{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    dishes : [favdishSchema]
},{
    timestamps: true
});


var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;