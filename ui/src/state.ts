import { reactive } from "vue";

export const state = reactive({
  push(path: string) {
    window.history.pushState({}, "", path);
    this.route = path.replace("/", "");
  },
  route: window.location.pathname.replace("/", ""),
});
