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
    const meetingId = getRouterParam(e, "meetingId");
    const body = await readBody<
      { date: Date; discussion: string; mentee_id: string }
    >(e);
    if (
      ["date", "discussion"].some((k) => !Object.hasOwn(body, k))
    ) {
      throw createError({
        statusCode: 400,
        statusText: "Invalid Form Body",
      });
    }
    try {
      await client.prisma.meetings.update({
        where: { id: Number(meetingId) },
        data: {
          date: new Date(body.date),
          discussion: body.discussion,
        },
      });
      return { message: "Meeting updated successfully!" };
    } catch (err) {
      console.log(err);
      throw createError({
        statusCode: 400,
        statusText: "Invalid Form Body",
      });
    }
  }
});
