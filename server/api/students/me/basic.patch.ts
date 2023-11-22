import { Client } from "../../../utils/database.js";

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

    const body = await readBody<
      {
        year: number;
        batch: number;
        section: string;
      }
    >(e);
    await client.prisma.students.update({
      where: { user_id: Number(jwtPayload.id) },
      data: {
        year: body.year,
        batch: body.batch,
        section: body.section,
      },
    });
    return {
      message: "Successfully assigned mentor.",
    };
  }
});
