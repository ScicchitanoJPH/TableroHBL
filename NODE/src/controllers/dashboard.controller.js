//const User = require('../dao/models/users.model.js');
const DashboardRepository = require('../repositories/dashboard.repositoy.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { DeviceDto } = require('../dto/deviceDto.js');


// Function definitions for userLogin, signUp, showLogin, and showRegister
// (Assuming your code defines these functions)
class DashboardController{
    constructor(){
        this.service = new DashboardRepository(new DeviceDto())
    }
    async getUserDashboards(req,res){

    }
    async createDashBoard(req,res){
        //creo un tablero nuevo vacio para el usuario pasado por parametro
        const userid = req.params.uid
        try{
            //le paso los datos al dashboradRepository el cual se encarga de usar el dao correcto
            const newDashboard = await this.service.create()
            return res.status(200).json({status : 'success',payload : newDashboard})
        }
        catch{
            return res.status(500).json({status : 'error',msg: `${error.message}`})
        }
    }
    async showDashboard(req,res){
        //obtengo uid via body
        //Busco los tableros asociados
        //los paso al front
        return res.render('dashboard')
    }
}
const controller = new DashboardController()
// Export the functions as an object (common approach with require)
module.exports =   controller;
