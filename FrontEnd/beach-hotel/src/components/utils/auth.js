import jwtDecode from "jwt-decode";

export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return ""; // ✅ trả về "" thay vì null

  try {
    const decoded = jwtDecode(token);
    return decoded.roles || ""; // ✅ fallback nếu roles undefined
  } catch {
    return ""; // ✅ trả về "" thay vì null
  }
};
