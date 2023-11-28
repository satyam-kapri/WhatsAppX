const jwt=require('jsonwebtoken');

module.exports.validatejwt=(req,res,next)=>{

const token=req.cookies?.token;
if(token){
jwt.verify(token,process.env.JWT_SECRET,(err, decoded) => {
    if (err) {
     
      return res.status(401).json({ message: 'Token is not valid' });
    } else {
      
      req.userid = decoded.userid;
      next(); 
    }
  })
}else{
    return res.status(401).json({ message: 'Token not found' });
}
}

module.exports.checkloggedInorNot=(req,res,next)=>{
  const token=req.cookies?.token;
  if(token){
  jwt.verify(token,process.env.JWT_SECRET,(err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token is not valid' });
      } else {
         res.status(200).json({message:'already loggedin'})
      }
    })
  }else{
      return res.status(401).json({ message: 'Not loggedin' });
  }
}