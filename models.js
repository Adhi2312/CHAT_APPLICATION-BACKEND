const mongoose = require('mongoose')
const Schema = mongoose.Schema
const user=new Schema(
    {
    username:{type: 'string', required: true},
    
    password: {type : 'string'}
    ,
    email:{
        type: 'string',
         

     },
     rooms:[],
     mobileno:{
         type: "number",
         
     }
}
)
const User=mongoose.model('User',user)
const room = new Schema({
    room_name: {type : 'string'},
    room_code: {type : 'string',unique : false},
    group_chat: {type :"boolean"},
    author:{type : mongoose.Schema.Types.ObjectId,ref:'User'},
    users:[{userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'

    }}
]

})
const message = new Schema({
    mess:{type : 'string'},
    room:{type : 'string'},
    author:{type : mongoose.Schema.Types.ObjectId,ref:'User'},
    
})




const Room=mongoose.model('Room',room)
const Message=mongoose.model('Message',message)

module.exports = {User,Room,Message}