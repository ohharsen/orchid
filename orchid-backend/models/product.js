var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {
        type: String, 
        required: true, 
        max: 100, 
        trim: true
    },
    sku: {
        type: String, 
        required: true, 
        max: 100, 
        trim: true
    },
    price: {
        type: Number, 
        required: true, 
        min: 0
    },
    quantities: [{
        store: {
            type: Schema.Types.ObjectId, 
            ref: 'Store', 
            //required: true
        },
        quantity: {
            type: Number, 
            required: true, 
            min: 0
        }
    }],
    cost: {
        type: Number, 
        min: 0
    },
    categories: [{
                type: Schema.Types.ObjectId, 
                ref: 'Category'
        }],
    tags: [String],
    image: Buffer
});

ProductSchema
.virtual('url')
.get(function(){
    return '/products/' + this._id;
});

module.exports = mongoose.model('Product', ProductSchema);