import { hash } from "bcrypt";
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
    const body = await readBody<
      {
        regno: string;
        name: string;
        year: number;
        section: string;
        batch: number;
        department: string;
        password: string;
      }
    >(e);
    if (
      ["regno", "name", "year", "section", "batch", "department", "password"]
        .some((k) => !Object.hasOwn(body, k))
    ) {
      throw createError({
        statusCode: 400,
        statusText: "Invalid Form Body",
      });
    }
    const encryptedPass = await hash(
      body.password,
      10,
    );
    try {
      const user = await client.prisma.users.create({
        data: { username: body.regno, password: encryptedPass, level: 0 },
      });
      await client.prisma.students.create({
        data: {
          register_no: body.regno,
          user_id: user.id,
          name: body.name,
          year: body.year,
          section: body.section,
          batch: body.batch,
          department_id: body.department,
        },
      });
      return { message: "Account created successfully!" };
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "PrismaClientKnownRequestError") {
          // @ts-ignore ik
          if (err.code === "P2002") {
            // @ts-ignore ik
            const field = err.meta.target; //err.message.match(/\(`(\w+)`\)/);
            throw createError({
              statusCode: 400,
              statusText: `A student already exist with the provided ${
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
