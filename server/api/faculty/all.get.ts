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
    if (Number(jwtPayload.level) < 2) {
      throw createError({
        statusCode: 401,
        statusText: "You do not have permission.",
      });
    }
    const users = await client.prisma.faculty.findMany({
      include: { user: true, mentees: true },
    });
    if (users) {
      return users.map((user) => ({
        ...client.manager.createPartialFaculty(user),
        menteeCount: user.mentees.length,
      }));
    } else {
      // This def won't happen
      throw createError({
        statusCode: 404,
      });
    }
  }
});
