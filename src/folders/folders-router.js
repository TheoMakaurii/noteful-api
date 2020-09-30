const express = require('express');
const FoldersService = require('./folders-service');
const xss = require('xss')

const foldersRouter=express.Router()
const jsonParser = express.json();

const serializeData = data =>({
    id: data.id,
    folder: xss(data.folder),
    content: xss(data.content),
    date_published: data.date_published,
})

foldersRouter
    .route('/')
    .get((req, res, next)=>{
    const knexInstance = req.app.get('db')
    FoldersService.getAllFolders(knexInstance)
        .then(data =>{
        res.json(data.map(serializeData))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next)=>{
        const {folder, content} = req.body
        const newFolder = {folder, content}
    
        if(!folder){
        return res.status(400).json({
            error:{message: `Missing folder!`}
        })
    }
        FoldersService.insertFolder(
        req.app.get('db'), 
        newFolder
        )
        .then(data =>{
            res 
            .status(201)
            .location(`/api/folders/${data.id}`)
            .json({
                id: data.id,
                folder: xss(data.folder),
                content: xss(data.content),
                date_published: data.date_published
            })
        })
        .catch(next)
        }) 

foldersRouter
    .route('/:folder_id')
    .get((req,res, next)=>{
        const knexInstance = req.app.get('db')
        FoldersService.getById(knexInstance, req.params.folder_id)
        .then(data=>{
            if(!data){
                return res.status(404).json({
                    error: {message: `That folder isn't here`}
                })
            }
            res.json({
                id: data.id,
                folder: xss(data.folder),
                content: xss(data.content),
                date_published: data.date_published
            })
        })
        .catch(next)
    })
    .delete((req,res, next)=>{
        knexInstance= req.app.get('db')
            FoldersService.deleteFolder(
                knexInstance,
                req.params.folder_id
            )
            .then(affected =>{
                res.status(204).end()
            })
            .catch(next)
    })
module.exports = foldersRouter