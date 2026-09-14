import jwt from 'jsonwebtoken';

export const createToken=(user)=>{
    const accessToken=jwt.sign(
        {email:user.email, id:user.id, role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:'30d'}

    );
    return accessToken;
}


export const validateToken=(req,res,next)=>{
   
    const token=req.cookies.accessToken;
    console.log('token',token);

    if(!token){
        return res.status(401).json({
            message:"Please log in to continue."
        });
    }
    
    try{
        
        const validToken=jwt.verify(token,process.env.JWT_SECRET);
        if(validToken){
            //attach user data
            req.user=validToken;
            next()
        }
        
    } catch (error) {
        return res.status(401).json({message:"Invalid or expired tokens"})
        
    }
    
}
