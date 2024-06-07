class UserDto {
    constructor(user) {
        // Verifica si user no es undefined antes de acceder a sus propiedades
        if (user) {
            this.name = user.name;
            this.email = user.email;
            this.password = user.password;
            this.createdAt = user.createdAt;
        } else {
            // Si user es undefined, asigna valores predeterminados o maneja el error según sea necesario
            this.name = "";
            this.email = "";
            this.password = "";
            this.createdAt = "";
        }
    }
}

module.exports = { UserDto };