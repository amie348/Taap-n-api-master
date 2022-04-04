const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
  role: { type: String, required: true },
  features: [
    {
      name: { type: String, required: true },
      permissions: [{ type: String, required: true }],
    },
  ],
});

const RoleModal = mongoose.model("roles", roleSchema);
module.exports = RoleModal;
