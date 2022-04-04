const {
  getAllRoles,
  getRole,
  AddRole,
  updateRole,
  deleteRole,
} = require("./controller");

async function routes(fastify) {
  fastify.get("/", getAllRoles);
  fastify.get("/:id", getRole);
  fastify.post("/", AddRole);
  fastify.patch("/:id", updateRole);
  fastify.delete("/:id", deleteRole);
}

module.exports = routes;
