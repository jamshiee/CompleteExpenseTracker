import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export const hashPassword = async (userPass) => {
    const salt = await bcrypt.genSalt(10);
    const  hashedPassword = await bcrypt.hash(userPass,salt);
    return hashedPassword;
}

export const comparePassword = async (userPass,pass)=>{
    try {
        const isMatch = await bcrypt.compare(userPass,pass);
        return isMatch;
    } catch (error) {
        console.log(error)
    }
   
}

export const createJwt = (userId,res) =>{
    const jwtSign = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"1hr"})

    res.cookie('jwt',jwtSign)

      return jwtSign
}