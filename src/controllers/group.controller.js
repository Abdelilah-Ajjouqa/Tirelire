import * as groupServices from '../services/group.service.js';
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

        if (!userDoc.groups) userDoc.groups = [];
        if (!userDoc.groups.map(String).includes(savedGroup._id)) {
            userDoc.groups.push(savedGroup._id);
            await userDoc.save();
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
    //
}


// Member management
const listMembers = async (req, res) => {
    //
}

const addMember = async (req, res) => {
    //
}

const removeMember = async (req, res) => {
    //
}

const joinGroup = async (req, res) => {
    //
}

const leaveGroup = async (req, res) => {
    //
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