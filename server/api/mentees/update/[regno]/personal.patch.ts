import { Student } from "../../../../../types/types.js";
import { Client } from "../../../../utils/database.js";

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
    if (
      Number(jwtPayload.level) < 1
    ) {
      throw createError({
        statusCode: 401,
        statusText: "You do not have permission.",
      });
    }
    const currentUser = await client.prisma.faculty.findFirst({
      where: { user_id: Number(jwtPayload.id) },
    });
    if (!currentUser) {
      throw createError({
        statusCode: 404,
        statusText: "You do not exist.",
      });
    }
    const body = await readBody<
      Omit<Omit<Student["personal_info"], "father">, "mother">
    >(e);
    await client.prisma.students.update({
      where: { register_no: regno },
      data: {
        blood_group: body.blood_group,
        mobile_number: body.mobile_number,
        whatsapp_number: body.whatsapp_number,
        date_of_birth: new Date(body.date_of_birth || 0),
        gender: body.gender,
        email_id: body.email_id,
      },
    });
    return {
      message: "Successfully assigned mentor.",
    };
  }
});
