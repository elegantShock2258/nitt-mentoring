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
      Student["personal_info"]["father"]
    >(e);
    await client.prisma.students.update({
      where: { register_no: regno },
      data: {
        f_name: body?.name,
        f_occupation: body?.occupation,
        f_mobile_number: body?.mobile_number,
        f_whatsapp_number: body?.whatsapp_number,
        f_email_id: body?.email_id,
        f_address: body?.address
      },
    });
    return {
      message: "Successfully assigned mentor.",
    };
  }
});
