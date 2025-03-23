import axios from "axios";

const API_URL = "http://192.168.0.103:8000/api";

export const register = async (formData: FormData) => {
  try {
    const res = await axios.post(`${API_URL}/register/face/`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (error) {
    console.error("signup failed", error);
    throw error;
  }
};

export const login = async (formData: FormData) => {
  console.log("Début de login", new Date().toISOString());
  try {
    const res = await axios.post(`${API_URL}/login/face/`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Fin de login", res.data);
    document.cookie = `user=${res?.data}; path=/`;
    return res.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const login_formateur = async (email: string, password: string) => {
  try {
    const res = await axios.post(
      `${API_URL}loginAdmin`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    document.cookie = `userAdmin=${res.data}; path=/`;

    return res.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const logout = async (token: string) => {
  try {
    await axios.delete(`${API_URL}logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    document.cookie = "userCustomer=; Max-Age=0; path=/;";

    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};
