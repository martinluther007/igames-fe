"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ServiceConfig from "@/utils/constants/service.constants";

const BASE_URL = ServiceConfig.BASE_URL;

console.log(ServiceConfig.BASE_URL);

const Page = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      if (!username) return alert("Username is required to proceed");

      const { data } = await axios.post(`${BASE_URL}/auth/register`, {
        username,
      });
      const token = data.token;
      const user = data.data.user;
      console.log(token, user);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/home");

      setIsLoading(true);
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Something went wrong";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="bg-[#000] h-screen bg-[linear-gradient(to_right,_#0f2027,_#203a43,_#2c5364)] flex flex-col items-center justify-center w-full">
      <form className="bg-white shadow-2xl rounded-xl flex flex-col gap-5 p-20">
        <input
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="focus:outline-none border px-4 rounded-lg text-sm border-gray-300 placeholder:text-sm py-1.5"
        />
        <button
          onClick={login}
          disabled={isLoading}
          className="bg-cyan-500 disabled:opacity-20 hover:bg-cyan-600 transition-all cursor-pointer rounded-2xl text-white py-1.5 px-4"
        >
          submit
        </button>
      </form>
    </main>
  );
};

export default Page;
