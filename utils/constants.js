const fs = require('fs');
const path = require('path');

const STATUS = {
  ACTIVE: 'ACTIVE',
  IN_ACTIVE: 'IN_ACTIVE',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
};

const PERMISSIONS = {
  CREATE: 'Create',
  READ: 'Read',
  UPDATE: 'Update',
  DELETE: 'Delete',
};
const PUBLIC_FOLDER_NAME = 'public';

const PUBLIC_FOLDER = path.join(__dirname, '../', PUBLIC_FOLDER_NAME);

if (!fs.existsSync(PUBLIC_FOLDER_NAME)) {
  fs.mkdirSync(PUBLIC_FOLDER_NAME);
}

const globalConstants = {
  PERMISSIONS,
  STATUS,
  ADMIN_ROLE: "admin",
  PUBLIC_FOLDER_NAME,

  ADMIN_FEATURES: [
    {
      name: "users",
      permissions: ["create", "update", "delete", "read"],
    },
  ],
};

exports.PUBLIC_FOLDER = PUBLIC_FOLDER;
exports.PUBLIC_FOLDER_NAME = PUBLIC_FOLDER_NAME;
module.exports = globalConstants;
