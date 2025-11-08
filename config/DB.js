import mongoose from 'mongoose';

let dbcon=false;
const db=async ()=>{
   


    try{


    if(dbcon)
    {
    
       console.log("db is already connected");
       return ;
    }
    else{
         
         await mongoose.connect('mongodb://127.0.0.1:27017/DatePe');
         console.log("db is connected succesfully");
         dbcon=true;
    }

    } catch(err)
    {
          console.log("DB connection error",err);
    }


}

export default db;