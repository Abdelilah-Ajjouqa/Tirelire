import GroupServices from '../services/group.service.js';
import Group from '../models/Group.js';
import User from '../models/User.js';

class GroupController {
    // Group Management
    static async getAllGroups(req, res) {
        try {
            const allGroups = await Group.find();
            res.status(200).json({
                message: "all Groups",
                data: allGroups
            })
        } catch (error) {
            res.status(500).json({
                message: 'error, cannot access to getAllGroups()',
                error: error.message
            })
        }
    }

    static async getGroup(req, res) {
        try {
            const groupId = req.groupId;
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(400).json({
                    message: "group not exist",
                })
            }
            return res.status(200).json({
                message: "group founded",
                data: group
            })
        } catch (error) {
            res.status(500).json({
                message: "error, cannot access to getGroup()",
                error: error.message
            })
        }
    }

    static async createGroup(req, res) {
        try {
            const checkUser = req.user;
            const user = await User.findById(checkUser._id);
            if (!user) {
                return res.status(400).json({
                    message: "user not found"
                })
            }

            if (!checkUser.isKYCVerified) {
                return res.status(401).json({
                    message: "you don't verifie your KYC!"
                })
            }

            const data = req.body;

            const creatorId = user._id;
            const membersSet = new Set((Array.isArray(data.members) ? data.members : []));
            membersSet.add(creatorId);

            const newGroup = new Group({
                groupName: data.groupName,
                createdBy: [checkUser._id],
                members: Array.from(membersSet),
                amountPerCycle: Number(data.amountPerCycle),
                totalCycle: Number(data.totalCycle),
                paymentSchedule: Array.isArray(data.paymentSchedule) ? data.paymentSchedule.map(d => new Date(d)) : [],
                potDistributionOrder: Array.isArray(data.potDistributionOrder) ? data.potDistributionOrder : [],
                nextPayoutUser: data.nextPayoutUser || undefined,
                isActive: data.isActive !== undefined ? data.isActive : true,
                status: data.status || 'waiting'
            })

            const savedGroup = await newGroup.save();

            if (!user.groups) user.groups = [];
            if (!user.groups.map(String).includes(savedGroup._id.toString())) {
                user.groups.push(savedGroup._id);
                await user.save();
            }

            return res.status(201).json({
                message: "group created",
                data: savedGroup
            })
        } catch (error) {
            res.status(500).json({
                message: "error, cannot access to CreateGroupe()",
                error: error.message
            })
        }
    }

    static async updateGroup(req, res) {
        try {
            const { groupName } = req.body

            const user = await User.findById(req.user._id)
            if (!user) {
                return res.status(500).json({
                    message: "user not found"
                })
            }

            const group = await Group.findById(req.groupId);
            if (!group) {
                return res.status(500).json({
                    message: "group not found",
                })
            }

            const groupUpdated = { ...group, ...{ groupName } }
            group = groupUpdated;

            const savedGroup = await group.save()
            if (savedGroup)(
                res.status(200).json({
                    message: ""
                })
            )

        } catch (error) {
            res.status(500).json({
                message: "error, cannot access to updateGroup",
                error: error.message
            })
        }
    }

    static async deleteGroup(req, res) {
        try {
            const groupId = req.params.groupId;
            if(!(await Group.findById(groupId))){
                throw new Error('this group is not exist');
            }

            await Group.findByIdAndDelete(groupId);

            res.status(200).json({
                message: "the group deleted successfully"
            })
        } catch (error) {
            res.status(500).json({
                message: "error, cannot access to delete function",
                error: error.message,
            })
        }
    }

    // Member management
    static async listMembers(req, res) {
        try {
            const groupId = req.groupId;
            const members = await GroupServices.listMembers(groupId);
            
            return res.status(200).json({
                message: "members list retrieved successfully",
                data: members
            });
        } catch (error) {
            res.status(500).json({
                message: "error, cannot access to listMembers()",
                error: error.message
            });
        }
    }

    static async addMember(req, res) {
        try {
            const groupId = req.groupId;
            const data = req.body;
            const creatorId = req.user._id;

            const group = await GroupServices.addMember(groupId, data.userEmail, creatorId);

            return res.status(200).json({
                message: "member added successfully",
                data: group
            });
        } catch (error) {
            res.status(500).json({
                message: "error, cannot access to addMember()",
                error: error.message
            });
        }
    }

    static async removeMember(req, res) {
        try {
            const groupId = req.groupId;
            const data = req.body;

            const group = await GroupServices.removeMember(groupId, data.userId);

            return res.status(200).json({
                message: "member removed successfully",
                data: group
            });
        } catch (error) {
            res.status(500).json({
                message: "error, cannot access to removeMember()",
                error: error.message
            });
        }
    }

    static async joinGroup(req, res) {
        try {
            const groupId = req.groupId;
            const userId = req.user._id;

            const group = await GroupServices.joinGroup(userId, groupId);

            return res.status(200).json({
                message: "joined group successfully",
                data: group
            });
        } catch (error) {
            res.status(500).json({
                message: "error, cannot access to joinGroup()",
                error: error.message
            });
        }
    }

    static async leaveGroup(req, res) {
        try {
            const groupId = req.groupId;
            const userId = req.user._id;

            const group = await GroupServices.leaveGroup(userId, groupId);

            return res.status(200).json({
                message: "left group successfully",
                data: group
            });
        } catch (error) {
            res.status(500).json({
                message: "error, cannot access to leaveGroup()",
                error: error.message
            });
        }
    }

    // Cycles
    static async startCycle(req, res) {
        //
    }

    static async endCycle(req, res) {
        //
    }

    // Utility
    static async getUserGroups(req, res) {
        //
    }

    static async getGroupMessage(req, res) {
        //
    }

    static async changeStatus(req, res) {
        //
    }

    static async inviteMember(req, res) {
        //
    }
}

export default GroupController;