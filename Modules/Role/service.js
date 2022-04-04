const mongoose = require("mongoose");
const RoleModal = require("./model");

exports.checkRoleByName = async(role) => {
    const result = await RoleModal.findOne({ role });
    return result;
};

exports.checkRoleById = async(id) => {
    const result = await RoleModal.findOne({ _id: id });
    return result;
};
exports.checkIfValidObjectId = async(id) =>
    mongoose.Types.ObjectId.isValid(id);

exports.getRoles = async() => {
    const allData = await RoleModal.find();
    return allData;
};

exports.getRole = async(id) => {
    const role = await RoleModal.findById(id);
    return role;
};

exports.postRole = async(data) => {
    try {
        const role = new RoleModal(data);
        return await role.save();
    } catch (error) {
        return error;
    }
};

exports.removeRole = async(id) => {
    const removedRole = await RoleModal.findByIdAndRemove(id);
    return removedRole;
};

exports.updateRole = async(id, updatedRole) => {
    const updated = await RoleModal.findByIdAndUpdate(id, updatedRole, {
        new: true,
    });
    return updated;
};