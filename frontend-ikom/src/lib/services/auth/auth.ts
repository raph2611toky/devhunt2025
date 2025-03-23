import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const register = async (
  email: string,
  mobile: string,
  password: string,
  name: string,
  localisation_id: string
) => {
  try {
    const res = await axios.post(`${API_URL}register`, {
      email,
      mobile,
      password,
      name,
      localisation_id,
    });
    return res;
  } catch (error) {
    console.error("signup failed", error);
    throw error;
  }
};

export const login = async (formeData: unknown) => {
  try {
    const res = await axios.post(
      `${API_URL}/login/`,
      {
        formeData,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

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
