const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");


//CREATE TASK
router.post("/addTask", async (req, res) => {


    try{

        const {title, body, email} = req.body;
        const existingUser = await User.findOne({email});
    
        if (existingUser) {
            const list = new List({ title, body, user: existingUser._id, status: "todo" });
            await list.save().then(() => res.status(200).json({list}));
            existingUser.list.push(list);
            existingUser.save();
        }

    } catch(error) {
        console.log(error);
    }
});


//UPDATE TASK 
router.put("/updateTask/:id", async (req, res) => {


    try{

        const {title, body, email} = req.body;
        const existingUser = await User.findOne({email});
    
        if (existingUser) {
            await List.findByIdAndUpdate(req.params.id, { title, body });
            res.status(200).json({ message: "Task Updated" });            
        }

    } catch(error) {
        console.log(error);
    }
});




//DELETE TASK 
router.delete("/deleteTask/:id", async (req, res) => {


    try{

        const {email} = req.body;
        const existingUser = await User.findOneAndUpdate({email}, {$pull: {list: req.params.id}});
    
        if (existingUser) {
            await List.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Task Deleted" });
            await User.findOneAndUpdate({ email }, { $pull: { list: req.params.id } });
            
        }

    } catch(error) {
        console.log(error);
    }
});

//GET TAKS
router.get("/getTask/:id", async (req, res) => {
    const list = await List.find({user: req.params.id}).sort({createdAt: -1});
    if(list.length !== 0) {
        res.status(200).json({list: list});
    }else{
        res.status(200).json({message: "No tasks"})
    }
})

module.exports = router;