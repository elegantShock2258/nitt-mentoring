import type { Faculty, FacultyInfo, User } from "@/types/types.js";

export async function useUser() {
  const auth = useCookie<string>("nitt_token");
  if (!auth.value) return false;

  const user = await $fetch<User>(`/api/users/me`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${auth.value}` },
  });
  return user;
}

export async function useFaculty(
  id?: number,
): Promise<(Faculty & { menteeCount: number }) | false> {
  const auth = useCookie<string>("nitt_token");
  if (!auth.value) return false;
  if (id) {
    const user = await $fetch<(Faculty & { menteeCount: number })>(
      `/api/faculty/${id}`,
      {
        method: "GET",
        headers: { "Authorization": `Bearer ${auth.value}` },
      },
    );
    return user;
  } else {
    const user = await $fetch<(Faculty & { menteeCount: number })>(
      `/api/faculty/me`,
      {
        method: "GET",
        headers: { "Authorization": `Bearer ${auth.value}` },
      },
    );
    return user;
  }
}

export async function useAllFaculty(): Promise<
  (FacultyInfo & { menteeCount: number })[]
> {
  const auth = useCookie<string>("nitt_token");
  if (!auth.value) return [] as (FacultyInfo & { menteeCount: number })[];

  try {
    const users = await $fetch<(FacultyInfo & { menteeCount: number })[]>(
      `/api/faculty/dept`,
      {
        method: "GET",
        headers: { "Authorization": `Bearer ${auth.value}` },
      },
    );
    return users;
  } catch (e) {
    return [] as (FacultyInfo & { menteeCount: number })[];
  }
}

export async function useAllUsers(): Promise<
  ({ username: string; id: number; level: string })[]
> {
  const auth = useCookie<string>("nitt_token");
  if (!auth.value) return [];

  try {
    const users = await $fetch<
      ({ username: string; id: number; level: string })[]
    >(
      `/api/users/all`,
      {
        method: "GET",
        headers: { "Authorization": `Bearer ${auth.value}` },
      },
    );
    return users;
  } catch (e) {
    return [];
  }
}
