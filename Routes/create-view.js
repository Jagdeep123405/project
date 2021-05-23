const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('../verifyToken')
const verifyrest = require('../verifyTokenRest')

const {registerValidation, loginValidation} = require('../validation')


//authview
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname , '../auth.html'));
});

//Signup using form
router.post("/signup", async (req, res) => {
    let usernameExist = false;

    const {error} = registerValidation(req.body);
    if(error) return res.redirect('/?error=' + encodeURIComponent(error.details[0].message));

    mysqlConnection.query(
        "SELECT * FROM user WHERE username = ?",
        [req.body.username], (err, rows, fields) => {
            rows.length ? usernameExist=true : usernameExist=false;
        }
        
    );

    //salting
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.Password, salt);

    if(!usernameExist){
        mysqlConnection.query(
            "INSERT INTO user (username, password) VALUES (?,?)",
            [req.body.username, hashedPassword], (err, rows, fields) => {
                !err ? res.redirect("/") : console.log(err);
            }
        );    
    }else{
        return res.redirect('/?error=' + encodeURIComponent('username already exists!'));
    }
});


//Login using form
router.post("/login", async (req, res) => {

    let user={};

    const {error} = loginValidation(req.body);
    if(error) return res.redirect('/?error=' + encodeURIComponent(error.details[0].message));

    mysqlConnection.query(
        "SELECT * FROM user WHERE username = ?",
        [req.body.username], (err, rows, fields) => {
            rows.length ? user=rows[0] : user={};
        }
        
    );
    
    const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
    await sleep(1000);

    if(!user.username) return res.redirect('/?error=' + encodeURIComponent('username doesnot exists'));

    const validPass = await bcrypt.compare(req.body.Password, user.password);
    if(!validPass) return res.redirect('/?error=' + encodeURIComponent('Invalid Password'));

    const token = jwt.sign({id: user.id}, process.env.TOKEN_SECRET);
    res.cookie('username',req.body.username, { maxAge: 360000, httpOnly: false });
    res.cookie('auth-token', token, { maxAge: 360000, httpOnly: true });

    res.redirect('/view');
    
});


//Fetch using form
router.get("/view", verify, (req, res) => {
    mysqlConnection.query("SELECT * FROM bucket WHERE `by` = ?",[req.cookies.username], (err, rows, fields) => {
        !err ? res.render(path.join(__dirname , '../view.html'), { data: rows }) : console.log(err);
    });
});



//Insert using form
router.post("/create", verify, (req, res) => {
    mysqlConnection.query(
        "INSERT INTO bucket(`by`, `description`) VALUES (?,?)",
        [req.body.by, req.body.description], (err, rows, fields) => {
            !err ? res.redirect("/view") : console.log(err);
        }
    );
});

//Logout for form
router.post("/logout", verify, (req, res) => {
    res.clearCookie('auth-token');
    res.clearCookie('username');
    res.json({'loggedout': "logged out"});
});

module.exports = router;