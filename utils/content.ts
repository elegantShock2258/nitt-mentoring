import { Student } from "../types/types";

export const specialFields: (keyof Student["achievements"])[] = [
  "positions_of_responsibility",
  "scholarships",
  "competitions",
  "special_talents",
  "role_model",
  "objectives",
  "extra_curricular",
];

export const personalFields: ({
  name: keyof Student["personal_info"];
  type: "number" | "text" | "email" | "date";
} | {
  name: keyof Student["personal_info"];
  type: "multiple";
  options: string[];
})[] = [
  { name: "blood_group", type: "text" },
  { name: "mobile_number", type: "text" },
  { name: "whatsapp_number", type: "text" },
  { name: "date_of_birth", type: "date" },
  {
    name: "gender",
    type: "multiple",
    options: ["male", "female", "rather_not_say"],
  },
  { name: "email_id", type: "email" },
];
