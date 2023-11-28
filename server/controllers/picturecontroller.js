const {firebaseconfig}=require('../firebaseconfig');
const {initializeApp}=require('firebase/app');
const { getStorage, ref, uploadBytes,getDownloadURL,deleteObject }=require('firebase/storage');
const User=require('../models/userModel');
//-----------------------------------------------------------------------------------------------

const app=initializeApp(firebaseconfig);
const storage=getStorage(app);
module.exports.uploadprofilepic=async(req,res,next)=>{
  try{
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml']; 
    const allowedsize=1024*1024; 
    if(req.file && allowedImageTypes.includes(req.file.mimetype) && req.file.size<=allowedsize){
    
  const picurl=`profilepictures/${Date.now()}-${req.file.originalname}`
   const fileref=ref(storage,picurl);
   const uploadedfile=await uploadBytes(fileref,req.file.buffer,{contentType:req.file.mimetype});
   const filelink=await getDownloadURL(uploadedfile.ref);
try{
  let previousImageFilename=await User.findOne({_id:req.body._id});
  previousImageFilename=previousImageFilename.profileImage;
  if(previousImageFilename){
  const deleteref=ref(storage,previousImageFilename);
  await  deleteObject(deleteref);
  }
}catch(err){console.log(err);}

await User.updateOne({_id:req.body._id},{profileImage:filelink});

return res.status(200).json({pic:filelink});
}
}catch(err){console.log(err);return res.status(500).send();}
}

module.exports.uploadgrpprofilepic=async(req,res,next)=>{
  
  try{
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    const allowedsize=1024*1024; 
   const grp=await Group.findOne({_id:req.body._id});
   if(req.file && req.userid===grp.admin.toString() && allowedImageTypes.includes(req.file.mimetype) && req.file.size<=allowedsize){
   
        
  const picurl=`Groupprofilepictures/${Date.now()}-${req.file.originalname}`
  const fileref=ref(storage,picurl);
  const uploadedfile=await uploadBytes(fileref,req.file.buffer,{contentType:req.file.mimetype});
  const filelink=await getDownloadURL(uploadedfile.ref);

    try{
      let previousImageFilename=grp.profileImage;
      if(previousImageFilename){
      const deleteref=ref(storage,previousImageFilename);
      await  deleteObject(deleteref);
      }
    }catch(err){console.log(err);}

await Group.updateOne({_id:req.body._id},{profileImage:filelink});
res.status(200).json({pic:filelink});
}
}catch(err){console.log(err);return res.status(500).send();}
}




// // module.exports.uploadprofilepic=async(req,res,next)=>{
//     try{
//       if(req.file){
//     const uploadsDirectory = path.join(__dirname,'..', 'uploads');
//     let previousImageFilename=await User.findOne({_id:req.body._id});
//     previousImageFilename=previousImageFilename.profileImage;
//     if ( previousImageFilename!==null && fs.existsSync(path.join(uploadsDirectory, previousImageFilename))) {
//       fs.unlinkSync(path.join(uploadsDirectory, previousImageFilename));
     
//     }
//    await User.updateOne({_id:req.body._id},{profileImage:req.file.filename});
   
//    return res.status(200).json({pic:`http://192.168.141.45:5000/uploads/${req.file.filename}`});
//   }
//   }catch(err){console.log(err);return res.status(500).send();}
//   }