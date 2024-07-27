const {User,Room,Message}=require('./models')
const { Suprsend,Event,Workflow } = require("@suprsend/node-sdk");
const crypto = require("crypto");

const axios=require("axios");

const supr_client = new Suprsend("CRTnWIfCxuVZRj6rHVa6", "SS.WSS.pV5rb70RNidyDHOQr4TFrUSab1N0wroy2FZdPtV0");

exports.signup=async(req,res)=>{
    console.log('hai')
    try{
        const user1= await User.findOne({username: req.body.username})
        if(user1==null){
        const user = await User(req.body);
        
        const userProfile = supr_client.user.get_instance(req.body.username);
        
        const response = await userProfile.save();

        console.log(user)

        user.save(req,res);
        const hash = crypto
    .createHmac("sha256", "ei5GyOozePpwdJuz0pJmH7wS2rzZT2y4kiLrmYsF1SY")
    .update(req.body.username)
    .digest("base64url");
    const secret= hash.trimEnd("=");
    console.log("secs1",secret)
            res.send({message:"success",user:user,secret:secret});
    }
        else{
            res.send({message:"user already exists"})
        }
       
        

    }
    catch(err){console.log(err)}

}
exports.login=async(req,res)=>{
    // const API_KEY="ye1mKDodnRhtgdRTKN3x"
    console.log("hai")
    const user= await User.findOne({username:req.body.username,password:req.body.password})
    
    

    if(user==null){console.log("user not found")
        res.send({message:"User not found"})
    }
    else{
        console.log(user.username)
        const event = new Event(req.body.username,'chumma',{name:req.body.username});
        // const resp=supr_client.track_event(event);
        // console.log(resp)
        const hash = crypto
    .createHmac("sha256", "ei5GyOozePpwdJuz0pJmH7wS2rzZT2y4kiLrmYsF1SY")
    .update(req.body.username)
    .digest("base64url");
    const secret= hash.trimEnd("=");
    console.log("sec",secret)
        
        res.status(200).send({message:"user found",user:user,secret:secret});
    }
}
exports.findRoom=async(req,res)=>{
    console.log("kdfnksncskdj")
    try{
        const room = await Room.findOne({room_name:req.body.room_name,room_code:req.body.room_code}).populate('author').populate('users.userId')
        console.log(room)
        console.log("hello"+req.body.user_id)
        
        if (room !=null)
        {

            const user=await User.findOne({_id:req.body.user_id})
            console.log(user.rooms.includes(req.body.room_code))
            if(!(user.rooms.includes(req.body.room_code)))
            {
                console.log('hai u are in')
                console.log(user)
                room.users.push(req.body.user_id);
                user.rooms.push(req.body.room_code);
                
                room.save();
                user.save();
                console.log(room);
                const Workflow_body={
                    "name":'message_workflow',
                    "template":"message",
                    "notification_category":"transactional",
                    "users":[{
                        "distinct_id":user.username
            
                    }],
                    "data":{
                        "mess":`welcome to our chat room ${user.username} `,
                        "room_name":req.body.room_name
                    }
                }
                const workflow = new Workflow(Workflow_body,{});
                const resp=supr_client.trigger_workflow(workflow);
                console.log(resp);
            }
            else{
                console.log(room);
                console.log("already logged in")
                const Workflow_body={
                    "name":'message_workflow',
                    "template":"message",
                    "notification_category":"transactional",
                    "users":[{
                        "distinct_id":user.username
            
                    }],
                    "data":{
                        "mess":`welcome again`,
                        "room_name":req.body.room_name
                    }
                }
                const workflow = new Workflow(Workflow_body,{});
                const resp=supr_client.trigger_workflow(workflow);
                console.log(resp);
            }
            res.status(200).send({message:"room found",data:room})
            
    }
            else{
                res.send({message:"Room doesnt exist"})
            }
            // const roomadd=await Room.findOne({room_name:req.body.room_name})
            // console.log(roomadd)
        
    }
    catch(err){console.log(err)}
}
exports.createRoom=async(req, res)=>{
    console.log("hr;;")
    console.log(req.body)
    const name= await Room.findOne({room_name:req.body.room_name})
  
    if(name==null){
        {
            
            try{const room=await Room(req.body);
                room.save(req,res);
                console.log(room);
                const Workflow_body={
                    "name":'message_workflow',
                    "template":"message",
                    "notification_category":"transactional",
                    "users":[{
                        "distinct_id":req.params.name
            
                    }],
                    "data":{
                        "mess":`hey ${req.params.name}, your room have been sucessfully created`,
                        "room_name":'Chatzy'
                    }
                }
                const workflow = new Workflow(Workflow_body,{});
                const resp=supr_client.trigger_workflow(workflow);

                res.status(200).send({message:"Room created"})
            }
                catch(err){console.log(err)}
        }}

    else{
        if (name!=null){console.log("room already exists")}
        else if(code!=null){console.log("room code already taken")}
    }
}


exports.getMessage=async(req, res)=>{
    console.log(req.params.name);
    try{
        const message = await Message.find({room:req.params.name}).populate('author')
        // console.log("scjhfgj"+message)
        res.json(message)
    }
    catch(err){console.log(err)}
}
exports.postMessage=async(req, res)=>{
    console.log("messaging")
    console.log(req.body)
    try{
        const new_message = await Message(req.body);
        new_message.save();
        console.log(new_message);
        console.log('message created')
    }
    catch(err){console.log(err)}
}
exports.controllTrigger=async(req, res)=>{

    console.log('hai')
    
    
}
exports.getAll=async(req, res)=>{
    const fet=await Room.find({room_name:req.params.name}).populate('author').populate('users');
    console.log(fet)
    res.json(fet);
}
exports.deleteRoom=async(req,res)=>{
    console.log('hai')
    const re=await Room.deleteMany({})
    res.send('deleted')
}
exports.deleteMessage=async(req,res)=>{
    console.log('hai')
    const re=await Message.deleteMany({})
    res.send('deleted')
}
exports.deleteUser=async(req,res)=>{
    console.log('hai')
    const re=await User.deleteMany({})
    res.send('deleted')
}