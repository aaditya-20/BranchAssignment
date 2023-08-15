const User = require("../model/userModel")
const bcrypt = require("bcrypt")

module.exports.register = async (req,res,next) =>{
    try {
        const {username,email,password,admin} = req.body
        const usernameCheck = await User.findOne({username});
        if(usernameCheck){
            return res.json({msg:"Username already used",status:false});
        }
        const emailCheck = await User.findOne({email});
        if(emailCheck){
            return res.json({msg:"Email already used",status:false});
        }
        const hashPassword = await bcrypt.hash(password,1298);
        const user = await User.create({
            email,username,password:hashPassword,admin
        })
        delete user.password;
        return res.json({status:true,user})
    } catch (error) {
        next(error)
    }
    
}
module.exports.login = async (req,res,next) =>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email});
        if(!user){
            return res.json({msg:"Incorrect username or password",status:false});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.json({msg:"Incorrect username or password",status:false});
        }
        delete user.password;
        return res.json({status:true,user})
    } catch (error) {
        next(error)
    }
}