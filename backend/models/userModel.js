const mongoose=require('mongoose');
const bcrypt= require("bcryptjs");
const userModel= mongoose.Schema(
    {
        name: {type:String,required:true},
        email : {type:String,required:true, unique: true },
        password: {type:String,required:true},
        pic: {type:String,default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
    },
    {
        timestamps:true
    }
);

userModel.methods.matchPassword= async function(entered_password){
    return await(bcrypt.compare(entered_password,this.password));
}


userModel.pre("save",async function(next){
    if (!this.isModified){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);

});
// before saving user to database it will encrypt the password
const User= mongoose.model("User",userModel);

module.exports=User;