import { hash } from "bcrypt";
import { PrismaClient } from '@prisma/client'

const client = new PrismaClient();

const args = process.argv.slice(2)

const body = {
  username: args[0],
  password: args[1],
  level: Number(args[2])
}
const encryptedPass = await hash(
  body.password,
  10,
);
const user = await client.users.create({
  data: { username: body.username, password: encryptedPass, level: body.level },
});
console.log({ message: "Account created successfully!" });
