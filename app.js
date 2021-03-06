const express = require('express');
const bodyPaser = require('body-parser');
//importer les functions de reponse
const {success, error} = require('./functions')
const morgan = require('morgan')
const app = express();

const members = [
  {
    id: 1,
    name: 'John'
  },
  {
    id: 2,
    name: 'Louis'
  },
  {
    id: 3,
    name: 'Leo'
  }
]

/*
  Convention de réponses
  res.json() : envoie une réponse en json
*/

//morgan
app.use(morgan('dev'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//route pour  afficher un membre
app.get('/api/v1/members/:id', (req, res) => {

  let index = getIndex(req.params.id);

  if(typeof(index) == 'string') {
    res.json(error(index))
  } else {
    res.json(success(members[index]))
  }
})

//route pour afficher tous les membres ou bien choisir le nombre de membre à afficher (ex : /api/v1/members?max=2)
app.get('/api/v1/members', (req, res) => {
  if(req.query.max != undefined && req.query.max > 0) {
    res.json(success(members.slice(0, req.query.max)))
  } else if(req.query.max != undefined) {
    res.json(error('mauvaise valeur max'))
  } else {
    res.json(success(members))
  }
})


app.post('/api/v1/members', (req, res) => {
  if(req.body.name) {

    let sameName = false

    for (let index = 0; index < members.length; index++) {
      if(members[index].name == req.body.name) {
        sameName = true
        break
      }
    }

    if(sameName) {
      res.json(error('name already taken'))
    }else {

      let member = {
        id: members.length+1,
        name: req.body.name
      }
      members.push(member)
  
      res.json(success(member))
    }



  } else {
    res.json(error('no name value '))
  }
})

app.get('/api/v1/members/:id', (req, res) => {
  res.json(success(members[(req.params.id)-1].name))
})

app.listen(8080, () => {
  console.log('Started on port 8080!');
})

function getIndex(id) {
  for (let i = 0; i < members.length; i++) {
    if(members[i].id == id)
      return i
  }
  return 'wrong id'
}


/*

Middlewares
app.use( (req, res, next) => {
  console.log('URL : ', req.url);
  next();
})

app.get('/api', (req, res) => {
  res.send('Root Api')
})

app.get('/api/v1', (req, res) => {
  res.send('Api Version 1')
})

app.get('/api/v1/books/:id', (req, res) => {
  res.send(req.params)
})
/api/v1/books/4

*/
