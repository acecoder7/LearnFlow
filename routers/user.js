const { Router } = require('express');
const mongoose = require("mongoose");

const router = Router();

const User = mongoose.model("users");

const { ensureAuth } = require("../middleware/auth");

router.get("/dashboard", ensureAuth, (req, res) => {
    res.render("dashboard");
});


router.post("/create", async (req, res) => {
    //console.log(req.body);
    // const { firstName, lastName, email } = req.body;
    try {
        const user = await User.create({
            ...req.body
        });
        res.status(200).send({user});
        
    }catch(error) {
        console.log("Error creating user");
        res.status(500).send({error});
    };
});

router.patch("/update", async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email });
        if (user) {
            for (key in req.body) {
                user[key] = req.body[key];
            }
            user.save();
            res.status(200).send({ user });
        } else {
            res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ user });
        
    } catch (error) {
        console.log("Error updating user");
        res.status(500).send({ error });
    };
});


router.delete("/delete", async (req, res) => {
    try {
        const email = req.body.email;
        const delres = await User.deleteOne({ email });
        res.status(200).send({ delres });

    } catch (error) {
        console.log("Error deleting user");
        res.status(500).send({ error });
    
    }
});


router.get("/get", async (req, res) => {
    try {
        const email = req.query.email;
        const user = await User.findOne({ email });
        if (user) {
            res.status(200).send({ user });
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        console.log("Error getting user");
        res.status(500).send({ error });
    
    }
});

module.exports = router;