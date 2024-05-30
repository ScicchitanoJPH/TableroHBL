const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const eventsCollection = 'events';

const eventsSchema = new mongoose.Schema({
    from: String,
    to: String,
    mode: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now // Esta propiedad establece automáticamente la fecha y hora actual cuando se crea un nuevo documento
    }
});
eventsSchema.plugin(mongoosePaginate);

const eventModel = mongoose.model(eventsCollection, eventsSchema);

module.exports = {
    eventModel
};
