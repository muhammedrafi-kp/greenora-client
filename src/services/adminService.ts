import { loginAdmin, signUpAdmin } from "../api/authApi";


export const handleAdminLogin = async (email: string, password: string) => {
  try {
    const data = await loginAdmin(email, password);
    return data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};


export const handleAdminSignup = async (email: string, password: string) => {
  try {
    const data = await signUpAdmin(email, password);
    return data;
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};


// export const fetchAdminData = async () => {
//   try {
//     const data = await getAdminData();
//     return data;
//   } catch (error) {
//     console.error("Fetch Admin Data Error:", error);
//     throw error;
//   }
// };

