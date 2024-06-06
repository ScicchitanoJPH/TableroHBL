const DeviceRepository = require("../repositories/devices.repository")
const { DeviceDto } = require("../dto/deviceDto")


class DeviceController {
    constructor(){
        this.service = new DeviceRepository(new DeviceDto());
    }

    getDevices = async (req, res)=>{  
        try {
            const devices = await this.service.getDevices()
            console.log(devices)
            res.send(devices)
        } catch (error) {
            res.send({status: 'error', message: error})
            
        }    
    }

    

    getDevicesbyDevice = async (req, res)=>{
        const { hbl_id } = req.params
        const device = await this.service.getDevice({hbl_id: hbl_id})
    
        // console.log(req.params)
    
        res.send(device)
        return device;
    }
    
    getDevice = async (req, res)=>{
        const { uid } = req.params
        const device = await this.service.getDevice({_id: uid})
    
        // console.log(req.params)
    
        res.send(device)
    }
    
    createDevice = async (req, res) => {
        console.log(req.body);
        const { hbl_id, ip, mask, dns, last_connection, mode } = req.body;
    
        const newDevice = {
          hbl_id,
          ip,
          mask,
          dns,
          last_connection,
          mode
        };
        console.log("newDevice : " + newDevice);
        try {
          // Check if a device with the same hbl_id already exists
          let existingDevice = null;
          existingDevice = await this.service.exists({ hbl_id: newDevice.hbl_id});
          
          if (existingDevice) {

            const updatedDevice = await this.service.updateDevice(hbl_id, newDevice);
    
            res.status(200).send({
              status: "success",
              message: "Device with hbl_id already exists. Updated existing device.",
              device: updatedDevice,
            });
          } else {
            // Create new device if no existing one found
            const result = await this.service.createDevice(newDevice);
            console.log("New device created:", result);
    
            res.status(200).send({
              status: "success",
              message: "New device created.",
              device: result,
            });
          }
        } catch (error) {
          console.error("Error creating device:", error);
          res.status(500).send({ status: "error", message: error.message });
        }
      };
    
    updateDevice =  async (req, res)=>{
        const {uid} = req.params
        const deviceToUpdate = req.body
    
        const result = await this.service.updateDevice(uid, deviceToUpdate)
    
        res.status(200).send({
            status: 'success',
            message: result
        })
    }
    
    deleteDevice =  async (req, res)=>{
        const { uid } = req.params
        const result = await this.service.deleteDevice( uid)
        res.send(result)
    }
}

module.exports = DeviceController