class DashboardDto {
    constructor(dashboard) {
        // Verifica si dashboard no es undefined antes de acceder a sus propiedades
        if (dashboard) {
            this.name = dashboard.name;
            this.devices = dashboard.devices
            this.users = dashboard.users
            this.createdAt = dashboard.createdAt
        } else {
            // Si dashboard es undefined, asigna valores predeterminados o maneja el error según sea necesario
            this.name = "New Dashboard";
            this.devices = []
            this.users = []
            this.createdAt = Date.now()
        }
    }
}

module.exports = { DashboardDto };