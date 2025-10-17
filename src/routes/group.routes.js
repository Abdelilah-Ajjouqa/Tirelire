import e from 'express';
import * as groupControllers from '../controllers/group.controller.js';

const router = e.Router();

router.get('/', ) // get all groups
router.post('/', ) // create a new group
router.get('/:groupId', ) // get specific group
router.delete('/:groupId', ) // delete a specific group
router.patch('/:groupId', ) // update a group

export default router;