import api from "../utils/api";

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", { email, password });
  const { token, user } = data.data;

  if (token) {
    localStorage.setItem("token", token);
  }
  return { token, user };
};

export const register = async (payload: {
  name: string;
  email: string;
  password: string;
  role: "BUYER" | "FARMER" | "ADMIN";
}) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/users/me");
  return data;
};
