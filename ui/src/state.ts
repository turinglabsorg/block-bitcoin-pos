import { reactive } from "vue";
import axios from "axios";

export const state = reactive({
  push(path: string) {
    window.history.pushState({}, "", path);
    this.route = path.replace("/", "");
  },
  getRouteParams: (param: string) => {
    const url = new URL(window.location.href);
    return url.searchParams.get(param);
  },
  route: window.location.pathname.replace("/", "").split("/")[0],
  getUser: async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await axios.get(`${apiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${state.session}`,
      },
    });
    if (response.data.error || !response.data.user) {
      return null;
    }
    return response.data.user;
  },
  session: localStorage.getItem("blockpos_session") ?? "",
  login: (session: string) => {
    localStorage.setItem("blockpos_session", session);
    window.location.href = "/";
  },
  logout: () => {
    localStorage.removeItem("blockpos_session");
    window.location.href = "/login";
  },
});
