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
      Student["personal_info"]["mother"]
    >(e);
    await client.prisma.students.update({
      where: { register_no: regno },
      data: {
        m_name: body?.name,
        m_occupation: body?.occupation,
        m_mobile_number: body?.mobile_number,
        m_whatsapp_number: body?.whatsapp_number,
        m_email_id: body?.email_id,
        m_address: body?.address
      },
    });
    return {
      message: "Successfully assigned mentor.",
    };
  }
});
