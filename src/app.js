require ('dotenv').config();
const  express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const NotesRouter = require ('./notes/notes-router')
//const NotesService = require('./notes-service');
const FoldersRouter = require ('./folders/folders-router');
//const FoldersService = require('./folders/folders-service');
// const jsonParser = express.json();
const app = express();



const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/folders', FoldersRouter)

app.use('/api/notes', NotesRouter)

app.get('/', (req, res)=>{
  res.send('what a good destination!');
});


app.use(function errorHAndler(error, req, res, next){
    let response
    if(NODE_ENV === 'production'){
        response = {error: {message: 'whoops! server error'}}
    } else{
        console.error(error)
        response ={message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app;