const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const eventsCollection = 'events';

const eventsSchema = new mongoose.Schema({
    from: String,
    to: String,
    mode: String,
    message: String,
    // La opción set de createdAt se asegura de que si se proporciona un valor,
    // este se utiliza; de lo contrario, se utiliza la fecha y hora 
    // actuales (Date.now()).
    createdAt: String
});
eventsSchema.plugin(mongoosePaginate);

const eventModel = mongoose.model(eventsCollection, eventsSchema);

module.exports = {
    eventModel
};
