export default defineNuxtRouteMiddleware(async (to, _from) => {
  try {
    const user = await useUser();
    if (!user) {
      return navigateTo(`/login?redirect=${to.fullPath}`);
    }
    const userStore = useUserStore();
    userStore.loggedIn = true;
    userStore.id = user.id;
    userStore.username = user.username;
    userStore.level = user.level;
    if (user.level === 0) {
      const student = await useMe();
      // @ts-ignore
      userStore.student = student;
      userStore.department = student ? student.department.name : "NONE"
    }
  } catch (e) {
    return navigateTo(`/login?redirect=${to.fullPath}`);
  }
});
