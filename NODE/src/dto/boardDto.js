class BoardDto {
    constructor(board) {
        // Verifica si board no es undefined antes de acceder a sus propiedades
        if (board) {
            this.name = board.name;
            this.devices = board.devices;
            this.users = board.users;
        } else {
            // Si board es undefined, asigna valores predeterminados o maneja el error según sea necesario
            this.name = "";
            this.devices = [];
            this.users = [];
            
        }
    }
}

module.exports = { BoardDto };
