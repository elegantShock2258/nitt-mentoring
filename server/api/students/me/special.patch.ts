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
        positions_of_responsibility: string;
        scholarships: string;
        competitions: string;
        special_talents: string;
        role_model: string;
        objectives: string;
        extra_curricular: string;
      }
    >(e);
    await client.prisma.students.update({
      where: { user_id: Number(jwtPayload.id) },
      data: {
        positions_of_responsibility: body.positions_of_responsibility,
        scholarships: body.scholarships,
        competitions: body.competitions,
        special_talents: body.special_talents,
        role_model: body.role_model,
        objectives: body.objectives,
        extra_curricular: body.extra_curricular,
      },
    });
    return {
      message: "Successfully assigned mentor.",
    };
  }
});
