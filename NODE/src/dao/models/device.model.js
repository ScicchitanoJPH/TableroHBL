const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const devicesCollection = 'devices';

const devicesSchema = new mongoose.Schema({
    hbl_id: { 
        type: String,
        required: true,
        unique: true
    },
    hbl_name: String,
    client: String,
    version: String,
    mac_address: String,
    ip: String,
    mask: String,
    dns: String,
    last_connection: String,
    mode: String,
    ID_anydesk: String,
    time: {
        type: Date,
        default: Date.now // Esta propiedad establece automáticamente la fecha y hora actual cuando se crea un nuevo documento
    }
});
devicesSchema.plugin(mongoosePaginate);

const deviceModel = mongoose.model(devicesCollection, devicesSchema);

module.exports = {
    deviceModel
};
