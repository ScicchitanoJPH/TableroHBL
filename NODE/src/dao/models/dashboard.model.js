const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const boardsCollection = 'boards';

// name:  { type : String,required : true},
//         users: { type: [Number], required : true },
//         hblIDs : { type : [Number]},
//         createdAt : {type: Date,default : Date.now},


const boardsSchema = new mongoose.Schema({
    name : String,
    devices: {

        type: [{ 
            device: {
                type: mongoose.Types.ObjectId, ref : 'devices',
                unique:true
            }
        }]
    },
    users : {
        type : [{
                user :  {type :mongoose.Types.ObjectId,ref : 'users'}
                }]
        
    },
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

