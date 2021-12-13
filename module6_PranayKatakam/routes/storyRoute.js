const express = require('express');
const controller = require('../controllers/StoryController');

const router = express.Router();

//GET /stories: send all stories tothe user
router.get('/', controller.index);

//GET /stories/new send html form for creating a new story.

router.get('/new', controller.new);

//POST /stories: create a new story

router.post('/', controller.create);


//GET /stories/:id send details pf story identified by id

router.get('/:id', controller.show);

//GET /stories/:id/edit: send html form for existing story

router.get('/:id/edit', controller.edit);


//PUT /stories/:id: update the story identified bu id

router.put('/:id', controller.update);

//DELETE /stories/:id , delete the story identified by the id

router.delete('/:id', controller.delete);




module.exports = router;
