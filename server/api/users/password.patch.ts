import { Client } from "../../utils/database.js";
import { hash } from "bcrypt";
import { compare } from "bcrypt";
const client = new Client();
type userInput = {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  username: string,
};
export default defineEventHandler(async (e) => {
    try { 
      const body = await readBody<userInput>(e);
      if (!body.currentPassword) {
        throw new Error("ENTER_CURRENT_PASSWORD")
      }
      if (!body.newPassword||!body.confirmPassword) {
        throw new Error("CONFIRM_PASSWORD")
      }
      if (body.newPassword!==body.confirmPassword) {
        throw new Error("PASSWORD_MISMATCH")
      }
      const user = await client.prisma.users.findFirst({
        where: { username: body.username },
      });
      if(!user){
        throw new Error("USER_NOT_FOUND")
      }
      const equal = await compare(body.currentPassword, user.password);
      
      if(equal){
        const encryptedPass = await hash(
          body.newPassword,
          10,
        );
        const updateUser=await client.prisma.users.update({
          where: {
            username: body.username,
          },
          data: {
            password: encryptedPass,
          },
      })
      return { message: "Password Changed Successfully" };
      } 
      else{
      throw new Error("WRONG_CURRENT_PASSWORD")
     }
    }catch (error:unknown) {
      if(error instanceof Error){
         return createError({
          statusText:error.message
         })  
      }
    }
  });
  