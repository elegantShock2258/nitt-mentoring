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
    const regno = getRouterParam(e, "regno");
    const mentee = await client.prisma.students.findFirst({
      where: { register_no: regno },
      include: {
        meetings: true,
        mentor: true,
        academics: true,
      }
    });
    if (mentee) {
      if (
        Number(jwtPayload.level) < 2 &&
        mentee.mentor?.user_id !== Number(jwtPayload.id)
      ) {
        throw createError({
          statusCode: 401,
          statusText: "You do not have permission.",
        });
      }
      return client.manager.createStudent(mentee);
    } else {
      throw createError({
        statusCode: 404,
      });
    }
  }
});
