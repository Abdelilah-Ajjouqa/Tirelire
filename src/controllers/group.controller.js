import GroupServices from '../services/group.service.js';
import Group from '../models/Group.js';
import User from '../models/User.js';


//Group Managment
const getAllGroups = async (req, res) => {
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

const getGroup = async (req, res) => {
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

const createGroup = async (req, res) => {
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

        const {
            groupName,
            amountPerCycle,
            totalCycle,
            isActive = true,
            members = [],
            paymentSchedule = [],
            potDistributionOrder = [],
            nextPayoutUser = null,
            status = 'waiting'
        } = req.body;

        // validate required fields
        if (!groupName || typeof groupName !== 'string' || !groupName.trim()) {
            return res.status(400).json({ message: 'groupName is required' });
        }
        if (amountPerCycle == null || isNaN(Number(amountPerCycle))) {
            return res.status(400).json({ message: 'amountPerCycle is required and must be a number' });
        }
        if (totalCycle == null || !Number.isInteger(Number(totalCycle)) || Number(totalCycle) <= 0) {
            return res.status(400).json({ message: 'totalCycle is required and must be a positive integer' });
        }

        const creatorId = user._id;
        const membersSet = new Set((Array.isArray(members) ? members : []));
        membersSet.add(creatorId);

        const newGroup = new Group({
            groupName: groupName,
            createdBy: [checkUser._id],
            members: Array.from(membersSet),
            amountPerCycle: Number(amountPerCycle),
            totalCycle: Number(totalCycle),
            paymentSchedule: Array.isArray(paymentSchedule) ? paymentSchedule.map(d => new Date(d)) : [],
            potDistributionOrder: Array.isArray(potDistributionOrder) ? potDistributionOrder : [],
            nextPayoutUser: nextPayoutUser || undefined,
            isActive,
            status
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

const updateGroup = async (req, res) => {
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

const deleteGroup = async (req, res) => {
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
const listMembers = async (req, res) => {
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

const addMember = async (req, res) => {
    try {
        const groupId = req.groupId;
        const { userEmail } = req.body;
        const creatorId = req.user._id;

        if (!userEmail) {
            return res.status(400).json({
                message: "userEmail is required"
            });
        }

        const group = await GroupServices.addMember(groupId, userEmail, creatorId);

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

const removeMember = async (req, res) => {
    try {
        const groupId = req.groupId;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "userId is required"
            });
        }

        const group = await GroupServices.removeMember(groupId, userId);

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

const joinGroup = async (req, res) => {
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

const leaveGroup = async (req, res) => {
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
const startCycle = async (req, res) => {
    //
}

const endCycle = async (req, res) => {
    //
}


// Utility
const getUserGroups = async (req, res) => {
    //
}

const getGroupMessage = async (req, res) => {
    //
}

const changeStatus = async (req, res) => {
    //
}

const inviteMember = async (req, res) => {
    //
}