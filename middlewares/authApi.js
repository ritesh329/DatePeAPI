
export const verifyApi=(req,res,next)=>{

 const clientToken=req.headers['apiKey'];
  const ApiSecret=process.env.APISECRET

  if(!clientToken)
  {
     return res.status(400).json({message:"Api key Missing"})
  }

  if(ApiSecret!==clientToken)
  {
      return res.status(400).json({message:"Api keys Invalid"})
  }

  next()

}