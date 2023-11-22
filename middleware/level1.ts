export default defineNuxtRouteMiddleware(async (to, _from) => {
  try {
    const user = await useUser();
    if (!user || user.level < 1) {
      if (user && user.level === 0) return navigateTo("/student/me");
      return navigateTo(`/login?redirect=${to.fullPath}`);
    }
    const userStore = useUserStore();
    userStore.loggedIn = true;
    userStore.username = user.username;
    userStore.id = user.id;
    userStore.level = user.level;
    if (user.level === 1 || user.level === 2) {
      const faculty = await useFaculty();
      // @ts-ignore
      userStore.faculty = faculty;
      userStore.department = faculty ? faculty.department.name : "NONE"
    }
  } catch (e) {
    return navigateTo(`/login?redirect=${to.fullPath}`);
  }
});
