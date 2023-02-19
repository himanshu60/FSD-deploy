const express = require("express");
const { NoteModel } = require("../models/note.schema");

const noteRouter = express.Router();




/**
 * @swagger
 * components:
 *  schemas:
 *      note:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto generated id of the user
 *              title:
 *                  type: string
 *                  description: The title of notes
 *              body:
 *                  type: string
 *                  description: Body name of notes
 *              userID:
 *                  type: string
 *                  description: user id of user
 */




/**
 * @swagger
 * /notes:
 *  get:
 *      summary: Here you will get all the users from database
 *      tags: [notes]
 *      responses:
 *          200:
 *              description: The list of all the notes
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: "#/components/schemas/note"
 */






noteRouter.get("/", async (req, res) => {
    const notes = await NoteModel.find();
    res.send(notes);
})



 /**
 * @swagger
 * /notes/create:
 *  post:
 *      summary: Here you can post the new note to the database
 *      tags: [notes]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/note"
 *      responses:
 *          200:
 *              description: The note is sucessfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/note"
 *          500:
 *              description: server error
 */



noteRouter.post("/create", async (req, res) => {
    const payload = req.body;
    const note = new NoteModel(payload);
    await note.save();
    res.send({ "msg": "Note Created" });
})


/**
 * @swagger
 * /notes/delete/{id}:
 *  delete:
 *      summary: This will get all the deleted notes from DB
 *      tags: [notes]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              required: true
 *              description: The notes id 
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/note"
 *      responses:
 *          200:
 *              description: the note details have been deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                        $ref: "#/components/schemas/note"
 *          404:
 *              description: the user was not found
 *                
 *                                  
 *                          
 *  
 */



noteRouter.delete("/delete/:id", async (req, res) => {
    const noteID = req.params.id;
    const note = await NoteModel.findOne({ "_id": noteID })
    const userID_note = note.userID;
    const userID_req = req.body.userID
    try {
        if (userID_req !== userID_note) {
            res.send({ "msg": "You are not Authorized" });
        } else {
            await NoteModel.findByIdAndDelete({ _id: noteID });
            res.send({ "msg": `Note with id ${noteID} has been Deleted` });
        }

    } catch (error) {

        res.send({ "msg": "unable to delete note", "error": error.message });
    }
})





/**
 * @swagger
 * /notes/update/{id}:
 *  patch:
 *      summary: This will get all the updates notes from DB
 *      tags: [notes]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              required: true
 *              description: The notes id 
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/note"
 *      responses:
 *          200:
 *              description: the note details have been updated
 *              content:
 *                  application/json:
 *                      schema:
 *                        $ref: "#/components/schemas/note"
 *          404:
 *              description: the user was not found
 *                
 *                                  
 *                          
 *  
 */



noteRouter.patch("/update/:id", async (req, res) => {
    const payload = req.body
    const noteID = req.params.id;
    const note = await NoteModel.findOne({ "_id": noteID })
    const userID_note = note.userID;
    const userID_req = req.body.userID
    try {
        if (userID_req !== userID_note) {
            res.send({ "msg": "You are not Authorized" });
        } else {
            await NoteModel.findByIdAndUpdate({ _id: noteID }, payload);
            res.send({ "msg": `Note with id ${noteID} has been updated` });
        }

    } catch (error) {

        res.send({ "msg": "unable to update note", "error": error.message });
    }

})


module.exports = { noteRouter }