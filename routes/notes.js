const express = require("express");
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require("../models/Note");
const { body, validationResult } = require('express-validator');

// Router 1 : get all the notes using  : Get "/api/notes/fetchallNotes" .Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        console.log("In notes.js backend");
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error ocuured");
    }


})

// Router 2 : Add a new note  using  : Post "/api/notes/addnote" .Login required

router.post("/addnote", fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),

], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        // console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()

        res.json({savedNote});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error ocuured");
    }




})


// Router 3 : Update a note  using  : put "/api/notes/updatenote" .Login required

router.put("/updatenote/:id" , fetchuser , async (req,res)=>{
    try {
        const {title, description ,tag} = req.body;
        // creacte a new note object
        const newNote = {}
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};
    
        // find the note to be updated and update it
    
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(400).send("Not found")}
    
        if(note.user.toString() !== req.user.id){
            return res.status(400).send("Not allowed")
        }
        
        note = await Note.findByIdAndUpdate(req.params.id , {$set: newNote} , {new : true})
        res.json({note}); 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error ocuured");
    }
    


})
// Router 4 : Delete a  note  using  : put "/api/notes/updatenote" .Login required


router.delete("/deletenote/:id" , fetchuser , async (req,res)=>{
    try {
        const {title, description ,tag} = req.body;    
        // find the note to be deleted and update it
    
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(400).send("Not found")}
    
        if(note.user.toString() !== req.user.id){
            return res.status(400).send("Not allowed")
        }
        
        note = await Note.findByIdAndDelete(req.params.id )
        res.json({"Success" : "Note has been deleted" , note : note}); 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error ocuured");
    }
    


})


module.exports = router