const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const boardsCollection = 'boards';

// name:  { type : String,required : true},
//         users: { type: [Number], required : true },
//         hblIDs : { type : [Number]},
//         createdAt : {type: Date,default : Date.now},


const boardsSchema = new mongoose.Schema({
    products: [

        hbl_id: { 
            type: String,
            required: true,
            unique: true
        }
    ],
    
    ip: String,
    mask: String,
    dns: String,
    last_connection: String,
    mode: String,
    createdAt: {
        type: Date,
        default: Date.now // Esta propiedad establece automáticamente la fecha y hora actual cuando se crea un nuevo documento
    }
});
boardsSchema.plugin(mongoosePaginate);

const boardModel = mongoose.model(boardsCollection, boardsSchema);

module.exports = {
    boardModel
};
