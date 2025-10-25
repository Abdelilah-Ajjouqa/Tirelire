import Group from "../models/Group";
import User from "../models/User";

export default class GroupServices {
    static async checkGroupExisting(groupId) {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('this group is not exist')
        }
        return group;
    }

    static async listMembers(groupId) {
        const group = await this.checkGroupExisting(groupId);
        return group.members;
    }

    static async addMember(groupId, userEmail, creatorId) {
        const group = await this.checkGroupExisting(groupId);

        if (group.createdBy.toString() !== creatorId.toString()) {
            throw new Error('Only the group creator can add members');
        }

        const user = await User.find({ email: userEmail });
        if (!user) {
            throw new Error('user nor found')
        }

        //check if deja exist
        if (group.members.includes(user._id)) {
            throw new Error('this user is aleady a member')
        }

        await group.updateOne({ $push: { members: user._id } })
        return group;
    }

    static async removeMember(groupId, userId) {
        const group = await this.checkGroupExisting(groupId);
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('no user found');
        }

        if (!(group.members.includes(userId))) {
            throw new Error('this user is not a member on the group');
        }

        group.members = group.members.filter(m => m.toString() !== userId.toString());
        await group.save();
        return group;
    }
}