const express = require('express');
const router = express.Router({mergeParams: true});
const mysqlConnection = require('../database');
const verify = require("../verifyToken");
const verifyrest = require("../verifyTokenRest");

//update using form
router.post("/update", verify, (req, res) => {
    mysqlConnection.query(
        "UPDATE bucket set `by` = ?, `description` = ? WHERE `id`= ?",
        [req.body.updateby, req.body.updatedescription, req.params.id], (err, rows, fields) => {
            !err ? res.redirect("/view") : console.log(err);
        }
    );
});

//Delete using form
router.get("/delete", verify, (req, res) => {
    mysqlConnection.query(
        "DELETE FROM bucket WHERE `id` = ?", [req.params.id], (err, rows, fields) => {
            !err ? res.redirect("/view") : console.log(err);
        }
    );
});

module.exports = router;