const express = require('express'); 
const routes = express.Router() ; 
const db = require('../models/USER1'); 
const room = require('../models/room'); 
const db1 = require('../models/BookingsHotel'); 
const jwt = require('jsonwebtoken');
const secret = 'ID22ZXS';






const auth = function(req, res, next) {
    const token =  req.headers['acces-token']
     if (!token) {
      res.json({message : "you are not auth to go here", isAuth : false});
    } else {
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
         res.json({message:"your token is wrong", isAuth : false})
        } else {
          req.email = decoded.email;
         
          next();
        }
      });
    }
}
  routes.post('/postdb', async (req,res)=>{
try{
  const post=await db1.create(req.body)
  res.send("done")
}
catch (error) {
  console.log(error)
  }

  })
  routes.post('/postroom', async (req,res)=>{
    try{
      const post=await room.create(req.body)
      res.send("done")
    }
    catch (error) {
      console.log(error)
      }
    
      })

// routes.get('/test', async (req,res)=>{
// console.log(req.params)
  // try{
// const posted = await db.create({room :req.body}); 
// res.send('DONE!')
// }
// catch(err){
// console.log(err)
// }
// }); 
routes.post('/getroom', auth ,async (req,res)=>{
  console.log(req.body)
  try{
  
   const update=await room.updateOne({_id :req.body._id ,dataI :"" ,dataO :"" },{dataI : req.body.datei , dataO : req.body.dateo })
   console.log(update.n)
   if(update.n){
    res.send("welcome")
  }
  else  {
    res.send("the room is not available")
  }
  }
catch(error){
  console.log(error)
}

})

routes.get('/getall',async (req,res)=>{
  try {
  const database = await db1.find(); 
  res.send(database)   
  } 
  catch (error) {
  console.log(error)
  }
}); 



routes.get('/getone/:id',async (req,res)=>{
  
  try {
    const hotel = await db1.findById(req.params.id)
    const rooms = await room.find({hotelname : hotel.name})
   res.send(rooms)
    
    
    } 
    catch (error) {
            console.log(error)
        }
}); 
    
  
routes.post('/email', async(req,res)=>{
try {

  

  
} 
catch (error) {
  
}
})






routes.post('/register', function(req, res) {
    const { email, password } = req.body;
    const user = new db({ email, password });
    user.save(function(err) {
      if (err) {
        console.log(err);
        res.status(500).send("Error registering new user please try again.");
      } else {
        res.status(200).send("Welcome to the club!");
      }
    });
});
  
routes.post('/login',function(req, res) {
      const { email, password } = req.body;
      db.findOne({ email }, function(err, user) {
        if (err) {
          console.error(err);
        
            res.json({
            error: 'Internal error please try again'
          });
        } else if (!user) {
          
            res.json({
            error: 'Incorrect email or password'
          });
        } else {
          user.isCorrectPassword(password, function(err, same) {
            if (err) {
              
                res.json({
                error: 'Internal error please try again'
              });
            } else if (!same) {
              res.json({
                error: 'Incorrect email or password'
              });
            } else {
             
              const payload = { email }; 
              const token = jwt.sign(payload, secret, {
                expiresIn: '2h'
              });
              res.json({token : token , email : email ,auth:true });
            }
          });
        }
      });
});

routes.get('/check', auth, function(req, res) {
    res.json({isAuth : true , message : "You are allowed to go here"})
});





module.exports = routes 