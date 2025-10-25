import e from 'express';
import GroupController from '../controllers/group.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = e.Router();

// Group Management
router.get('/', authenticate, GroupController.getAllGroups);
router.post('/', authenticate, GroupController.createGroup);
router.get('/:groupId', authenticate, GroupController.getGroup);
router.delete('/:groupId', authenticate, GroupController.deleteGroup);
router.patch('/:groupId', authenticate, GroupController.updateGroup);

// Member Management
router.get('/:groupId/members', authenticate, GroupController.listMembers);
router.post('/:groupId/members', authenticate, GroupController.addMember);
router.delete('/:groupId/members', authenticate, GroupController.removeMember);
router.post('/:groupId/join', authenticate, GroupController.joinGroup);
router.post('/:groupId/leave', authenticate, GroupController.leaveGroup);

// Cycles
router.post('/:groupId/cycles/start', authenticate, GroupController.startCycle);
router.post('/:groupId/cycles/end', authenticate, GroupController.endCycle);

// Utility
router.get('/user/groups', authenticate, GroupController.getUserGroups);
router.get('/:groupId/messages', authenticate, GroupController.getGroupMessage);
router.patch('/:groupId/status', authenticate, GroupController.changeStatus);
router.post('/:groupId/invite', authenticate, GroupController.inviteMember);

export default router;