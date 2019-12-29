const express = require("express");
const Event = require("../models/event");
const auth = require("../middleware/auth");
const router = new express.Router();


router.post("/event", auth, async (req, res) => {
  const event = new Event({ ...req.body, owner: req.admin._id });
  try {
    if(req.admin.type==0){
    await event.save();
    res.send(event);
  }
  else{
    throw new Error("this not super admain")
  }
  } catch (e) {
    res.send(e.message)
  }
});


router.post("/upcomingevents", auth, async (req, res) => {
  const upcomingevent = new Event({ ...req.body, owner: req.admin._id });
 

 {
  try {
    if(req.admin.type==0||req.admin.type==1){
    await  upcomingevent.save();
    res.send( upcomingevent );
  } 
  else{
    throw new Error("this not super admain or admin")
  }
  } catch (e) {
    res.send(e.message)
  }
}


});



router.get("/event", auth, async (req, res) => {
  const event = await Event.find({ owner: req.admin._id }).sort({
    description: 1
  });
 
  res.send(event);
});
router.get('/upcomingevents',auth,async(req,res)=>{
  const event = await Event.find({ owner: req.admin._id }).sort({
    description: 1
  });
if(timestamp==Date.now()){
  
}
  try{
    if(req.admin.type==0||req.admin.type==1)
    {
      
      res.send(event); 
    }
    else{
      throw new Error("this not super admain or admin")
    }
  }
  catch(e)
  {
    res.send(e.message)
}});
router.patch("/event/:id",auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ["title", "description"];

  var isvalid = updates.every(update => allowed.includes(update));
  console.log(isvalid);
  if (!isvalid) res.send("cann't update ");

  try {
    
    if(req.admin.type==0){
      const user = await Event.findByIdAndUpdate(req.params.id, req.body, {
      
        new: true,
        runValidators: true
      });
  
      if (!user) return res.send("not found");
      res.send(user);
    }
    else{
      throw new Error("this not super admain")
    }
   
  
  } catch (e) {
    res.send(e.message);
  }
});

router.delete('/event/:id',auth,async (req,res)=>
{
    try{
      
        const event=await Event.findByIdAndDelete(req.params.id)
        if(!event)
        {
            return res.status(404).send()
        }
        res.send(event)
    }
    catch(e){
        res.status(500).send()
    }
})


module.exports = router;
