const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');    


const mongoose=require('mongoose'); 
const captainSchema=new mongoose.Schema({
    fullname:{
       firstname:{
           type:String,
           required:true,
           minlength:[3,"Minimum 3 characters required"]
       },
         lastname:{
              type:String,
              required:true,
              minlength:[3,"Minimum 3 characters required"] 
         }
         
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:"active"
    },
    vehicle:{
        color:{
            type:String,
            required:true
        },
        plate:{
            type:String,
            required:true
        },
        capacity:{
            type:Number,
            required:true
        },
        type:{
            type:String,
            enum:['car','motorcycle','auto'],
            required:true
        }
    },
    location:{
        lat:{
            type:Number,
        },
        lng:{
            type:Number,
        }
    }

});

captainSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({_id:this._id}, process.env.JWT_SECRET, {expiresIn: '24h'});
    return token;
}

captainSchema.methods.comparePassword = async function(enteredPassword){   
    return await bcrypt.compare(enteredPassword, this.password);
}   
captainSchema.statics.hashPassword = async function(password){
  return await bcrypt.hash(password, 10);
}

const captainModel=mongoose.model('Captain',captainSchema);

module.exports=captainModel;