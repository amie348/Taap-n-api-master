const {
  checkIfValidObjectId,
  checkRoleById,
  checkRoleByName,
  getRole,
  getRoles,
  postRole,
  removeRole,
  updateRole,
} = require('./service');

//get all Role
exports.getAllRoles = async (request, reply) => {
  const result = await getRoles();
  return reply.status(200).send(result);
};

exports.getRole = async (request, reply) => {
  const { id } = request.params;

  try {
    if (!(await checkIfValidObjectId(id)))
      return reply.status(404).send(`no valid id : ${id}`);
    const Role = await getRole(id);
    return reply.status(200).send(Role);
  } catch (error) {
    return reply.status(404).send({ message: error });
  }
};

//create new Role
exports.AddRole = async (request, reply) => {
  const { role, features } = request.body;
  try {
    const obj = await checkRoleByName(role);
    if (obj) return reply.status(200).send({ message: 'Entry already exists' });
    const newRole = { role, features };
    await postRole(newRole);
    const result = await getRoles();
    return reply.status(201).send({ result });
  } catch (error) {
    return reply.status(500).send({ message: error });
  }
};

//delete Role by ID
exports.deleteRole = async (request, reply) => {
  const { id } = request.params;
  if (!(await checkIfValidObjectId(id)))
    return reply.status(404).send(`no valid id : ${id}`);
  if (!(await checkRoleById(id)))
    return reply.status(404).send('Entry does not exist ');

  const remoedRole = await removeRole(id);
  return reply.send(remoedRole);
};

//update Role by ID
exports.updateRole = async (request, reply) => {
  const { id } = request.params;
  const { role, features } = request.body;

  if (!(await checkIfValidObjectId(id)))
    return reply.status(404).send(`no valid id : ${id}`);
  if (!(await checkRoleById(id)))
    return reply.status(404).send('Entry does not exist ');

  const user = {
    role,
    features,
    _id: id,
  };

  const update = await updateRole(id, user);
  return reply.send(update);
};
