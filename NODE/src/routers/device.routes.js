const { Router } = require('express')
const DeviceController = require('../controllers/device.controller')

const router = Router()

const {
    getDevices,
    getDevicesbyDevice,
    getDevice,
    createDevice,
    updateDevice,
    deleteDevice
} = new DeviceController()

router.get('/',        getDevices )
router.get('/byhbl_id/:hbl_id',        getDevicesbyDevice )
router.get('/:uid',    getDevice) 
router.post('/',       createDevice) 
router.put('/:uid',    updateDevice) 
router.delete('/:uid', deleteDevice)


module.exports = router
