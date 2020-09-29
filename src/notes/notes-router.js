const express = require('express')
const NotesService = require('./notes-service');
const xss = require('xss')

const notesRouter=express.Router()
const jsonParser = express.json();

const serializeData = data =>({
    id: data.id,
    note: xss(data.note),
    folder: xss(data.folder),
    content: xss(data.content),
    date_published: data.date_published,
})

notesRouter
    .route('/')
    .get((req, res, next)=>{
    const knexInstance = req.app.get('db')
    NotesService.getAllNotes(knexInstance)
    .then(data =>{
        res.json(data.map(serializeData))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next)=>{
        const {note, content, folder} = req.body
        const newNote = {note, content, folder}
    
        if(!note){
            return res.status(400).json({
                error:{message: `Missing note!`}
            })
        }

        NotesService.insertNote(
        req.app.get('db'), 
        newNote
        )
        .then(data =>{
            res 
            .status(201)
            .location(`/api/notes/${data.id}`)
            .json(serializeData(data))
        })
        .catch(next)
        }) 

notesRouter
    .route('/:note_id')
    .get((req,res, next)=>{
        const knexInstance = req.app.get('db')
        NotesService.getById(knexInstance, req.params.note_id)
        .then(data=>{
            if(!data){
                return res.status(404).json({
                    error: {message: `That note isn't here`}
                })
            }
            res.json(serializeData(data))
        })
        .catch(next)
    })
    .delete((req,res, next)=>{
        knexInstance= req.app.get('db')
            NotesService.deleteNote(
                knexInstance,
                req.params.note_id
            )
            .then(affected =>{
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = notesRouter;