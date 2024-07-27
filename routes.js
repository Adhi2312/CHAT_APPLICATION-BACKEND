const express =require('express')
const router = express.Router()
const controller = require('./controller')
// module.exports =function(){
//      console.log('hai')
//     router.post('/signup',controller.signup);
//     router.post('/login', controller.login)
//     return router;
// }
router.get('/getAll/:name',controller.getAll);
router.post('/signup',controller.signup);
router.post('/login',controller.login);
router.post('/chumma',controller.controllTrigger);
router.post('/create/:name',controller.createRoom);
router.post('/getRoom',controller.findRoom);
router.post('/deleteMessage',controller.deleteMessage);
router.post('/deleteRoom',controller.deleteRoom);
router.post('/deleteuser',controller.deleteUser);
router.get('/getMessages/:name',controller.getMessage);
router.post('/postMessage',controller.postMessage);

// router.post('/message',controller.message);
module.exports = router;
