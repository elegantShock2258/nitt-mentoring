import { Client } from "../../utils/database.js";

const client = new Client();
export default defineEventHandler(async (e) => {
  const auth = getHeader(e, "Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    // Not a valid auth token
    throw createError({
      statusCode: 401,
      statusText: "Not logged in.",
    });
  } else {
    const token = auth.slice(7);
    const jwtPayload = await verifyJwt(token);
    if (!jwtPayload || (Date.now() / 1000) > jwtPayload.exp) {
      throw createError({
        statusCode: 401,
        statusText: "Session expired. Please login again.",
      });
    }
    if (Number(jwtPayload.level) < 1) {
      throw createError({
        statusCode: 401,
        statusText: "You do not have permission.",
      });
    }
    const user = await client.prisma.faculty.findFirst({
      where: { user_id: Number(jwtPayload.id) },
      include: { mentees: true, department: true },
    });
    if (user) {
      return client.manager.createFaculty(user);
    } else {
      throw createError({
        statusCode: 404,
        statusText: "No mentees found",
      });
    }
  }
});
