class DeviceDto {
    constructor(device) {
        // Verifica si device no es undefined antes de acceder a sus propiedades
        if (device) {
            this.hbl_id = device.hbl_id;
            this.ip = device.ip;
            this.mask = device.mask;
            this.dns = device.dns;
            this.last_connection = device.last_connection;
            this.mode = device.mode;
        } else {
            // Si device es undefined, asigna valores predeterminados o maneja el error según sea necesario
            this.hbl_id = "";
            this.ip = "";
            this.mask = "";
            this.dns = "";
            this.last_connection = "";
            this.mode = "";
        }
    }
}

module.exports = { DeviceDto };
