class EventDto {
    constructor(event) {
        if (event) {
            this.from = event.from;
            this.to = event.to;
            this.mode = event.mode;
            this.message = event.message;
            this.createdAt = event.createdAt || Date.now();  // Asigna el valor proporcionado o la fecha actual si está vacío.
        } else {
            this.from = "";
            this.to = "";
            this.mode = "";
            this.message = "";
            this.createdAt = Date.now();  // Asigna la fecha actual si no se proporciona ningún evento.
        }
    }
}

module.exports = { EventDto };