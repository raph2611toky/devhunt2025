import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post(`${API_URL}/login/`, { email, password });

    const dataString = JSON.stringify(res.data);

    const cookieOptions = [
      `formateur=${encodeURIComponent(dataString)}`,
      "path=/",
    ];

    if (typeof document !== "undefined") {
      document.cookie = cookieOptions.join("; ");
    }

    return res.data;
  } catch (error) {
    console.error("signup failed", error);
    throw error;
  }
};

export const addCour = async (
  titre: string,
  description: string,
  domaine: string,
  status: string,
  token: string
) => {
  try {
    const res = await axios.post(
      `${API_URL}/cours/create/`,
      {
        titre,
        description,
        domaine,
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("add failed", error);
    throw error;
  }
};

export const useCourList = () => {
  const { data, mutate, error } = useSWR(`${API_URL}/cours/list/`, fetcher);

  return {
    courList: data,
    mutate,
    isLoading: !data && !error,
    isError: error,
  };
};

export const addMod = async (formData: FormData, token: string) => {
  try {
    const res = await axios.post(`${API_URL}/cours/etapes/create/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("add failed", error);
    throw error;
  }
};
