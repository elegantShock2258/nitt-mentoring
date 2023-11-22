import { hash } from "bcrypt";
import { Client } from "../../utils/database.js";

const client = new Client();

type UserCreds = {
  username: string;
  password: string;
};

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
    if (Number(jwtPayload.level) < 3) {
      throw createError({
        statusCode: 401,
        statusText: "You do not have permission.",
      });
    }
    try {
      const users = await client.prisma.users.findMany();

      return users.map((x) => ({
        id: x.id,
        level: x.level === 0
          ? `Student`
          : x.level === 1
          ? `Faculty`
          : x.level === 2
          ? `HoD`
          : `NA`,
        username: x.username,
      }));
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "PrismaClientKnownRequestError") {
          // @ts-ignore ik
          if (err.code === "P2002") {
            // @ts-ignore ik
            const field = err.meta.target; //err.message.match(/\(`(\w+)`\)/);
            throw createError({
              statusCode: 400,
              statusText: `An account already exist with the provided ${
                field[0].split("_").join(" ")
              }`,
            });
          }
        }
      }
      throw createError({
        statusCode: 400,
        statusText: "Invalid Form Body",
      });
    }
  }
});
