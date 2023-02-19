const express = require("express");
const { UserModel } = require("../models/user.schema")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

// register swagger


/**
 * @swagger
 * components:
 *  schemas:
 *      user:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto generated id of the user
 *              name:
 *                  type: string
 *                  description: The name of the user
 *              email:
 *                  type: string
 *                  description: email of the register user
 *              pass:
 *                  type: string
 *                  description: password of the user
 */




/**
* @swagger
* /users/register:
*   post:
*       summary: To post the details of a new user
*       tags: [Users]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/user'
*       responses:
*           200:
*               description: The user was successfully registered
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/user'
*           500:
*               description: Some server error
*/

userRouter.post("/register", async (req, res) => {
    const { name, email, pass } = req.body;
    try {
        bcrypt.hash(pass, 5, async (err, hash) => {
            // Store hash in your password DB.
            if (err) {
                res.send({ "msg": "New user Unable to  registered", "error": error.message });
            } else {
                const user = new UserModel({ name, email, pass: hash });
                await user.save();
                res.send({ "msg": "New user has been registered" });
            }
        });

    }
    catch (error) {
        res.send({ "msg": "New user Unable to  registered", "error": error.message });
    }



})
// login




/**
 * @swagger
 * components:
 *  schemass:
 *      user:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto generated id of the user
 *              email:
 *                  type: string
 *                  description: email of the register user
 *              pass:
 *                  type: string
 *                  description: password of the user
 */




/**
* @swagger
* /users/login:
*   post:
*       summary: To post the details of a exist user
*       tags: [Users]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemass/user'
*       responses:
*           200:
*               description: The user was successfully loggedin
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemass/user'
*           500:
*               description: Some server error
*/

userRouter.post("/login", async (req, res) => {
    const { email, pass } = (req.body);
    try {
        const user = await UserModel.find({ email });
        // console.log(user)
        if (user.length > 0) {
            bcrypt.compare(pass, user[0].pass, (err, result) => {
                // result == true
                if (result) {
                    let token = jwt.sign({ userID: user[0]._id }, "masai", { expiresIn: "3600s" })
                    res.send({ "msg": "Logged In ", "token": token });
                } else {
                    res.send({ "msg": "Wrong credentials" });
                }
            });

        } else {
            res.send({ "msg": "Wrong credentials" });
        }
    } catch (error) {
        res.send({ "msg": "New user Unable to  Logged In", "error": error.message });
    }


})

module.exports = { userRouter }