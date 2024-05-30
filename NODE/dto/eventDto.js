class EventDto {
    constructor(event) {
        // Verifica si event no es undefined antes de acceder a sus propiedades
        if (event) {
            this.from = event.from;
            this.to = event.to;
            this.mode = event.mode;
            this.message = event.message;
        } else {
            // Si event es undefined, asigna valores predeterminados o maneja el error según sea necesario
            this.full_name = "";
            this.from = "";
            this.to = "";
            this.mode = "";
            this.message = "";
        }
    }
}

module.exports = { EventDto };
