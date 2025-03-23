export const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

export const getDecryptedCookie = <T>(name: string): T | null => {
  const cookieData = getCookie(name);
  if (!cookieData) return null;

  try {
    const decodedData = decodeURIComponent(cookieData);
    return JSON.parse(decodedData) as T;
  } catch (error) {
    console.error("Failed to parse cookie data", error);
    return null;
  }
};
