const User = require('../models/userModel');
const router = require('express').Router();
const bcrypt = require('bcrypt');
//signup

router.route('/signup').post((req, res) => {
    let {name, email, password} = req.body;
    name.trim();
    email.trim();
    password.trim();
    if(name == ""||email == "" || password == ""){
        res.json(
            {
                status: 'FAILED',
                message: 'Empty inputs'
            }
        )
    }
   else{
    User.find({email}).then(result => {
        if(result.length){
            res.json(
                {
                    status: 'FAILED',
                    message: 'User with this email already exists'
                }
            )
        }
        else{
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds).then(hashedPassword => {
                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword
                })
               
                newUser.save()
                .then(user=>res.json(user))
                .catch(err=>res.status(400).json("Error!" + err))
            }).catch(err=>{
                console.log(err);
                res.json(
                    {
                        status: 'FAILED',
                        message: 'An error occurred while setting password'
                    }
                )
            })
           
        }
    }).catch(err => {
        console.log(err);
        res.json(
            {
                status: 'FAILED',
                message: 'An error occurred'
            }
        )
    })
    }
});

//Login

router.route('/login').post((req, res)=> {
    let {email, password} = req.body;
    email.trim();
    password.trim();
    if(email=="" || password==""){
        res.json(
            {
                status: 'FAILED',
                message: 'Empty inputs'
            }
        )
    }
    else{
        User.find({email})
        .then(data => {
            if(data.length){
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword)
                .then(result => {
                    if(result){
                        res.json(
                            {
                                status: 'SUCCESS',
                                message: 'LOGIN SUCCESSFUL',
                                data: data
                            }
                        )
                    }
                    else{
                        res.json(
                            {
                                status: 'FAILED',
                                message: 'invalid password entered'
                            }
                        )
                    }
                }).catch(err => {
                    console.log(err);
                    res.json(
                        {
                            status: 'FAILED',
                            message: 'An error occurred'
                        }
                    )
                })
            }
        }).catch(err => {
            console.log(err);
            res.json(
                {
                    status: 'FAILED',
                    message: 'An error occurred'
                }
            )
        })
    }
})

module.exports = router;