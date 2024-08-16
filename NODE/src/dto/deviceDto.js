class DeviceDto {
    constructor(device) {
        // Verifica si device no es undefined antes de acceder a sus propiedades
        if (device) {
            this.hbl_id = device.hbl_id;
            this.hbl_name = device.hbl_name;
            this.client = device.client;
            this.version = device.version;
            this.mac_address = device.mac_address
            this.ip = device.ip;
            this.mask = device.mask;
            this.dns = device.dns;
            this.last_connection = device.last_connection;
            this.mode = device.mode;
            this.ID_anydesk = device.ID_anydesk;
        } else {
            // Si device es undefined, asigna valores predeterminados o maneja el error según sea necesario
            this.hbl_id = "";
            this.hbl_name = "";
            this.client = "";
            this.version = "";
            this.mac_address = "";
            this.ip = "";
            this.mask = "";
            this.dns = "";
            this.last_connection = "";
            this.mode = "";
            this.ID_anydesk = "";
        }
    }
}

module.exports = { DeviceDto };
