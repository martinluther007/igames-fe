"use client";

import IUser from "@/Interface/user.interface";
import IUserStats from "@/Interface/user.stats.interface";
import ServiceConfig from "@/utils/constants/service.constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import SocketHandler from "@/utils/socket";
import { showError } from "@/utils/helpers";
import { ClipLoader } from "react-spinners";
const socket = SocketHandler.getSocketInstance();

const Page = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [stats, setStats] = useState<IUserStats>({});
  const [countdown, setCountdown] = useState(null);
  const [timeTillNewSession, setTimeTillNewSession] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user");

    setToken(storedToken);
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${ServiceConfig.BASE_URL}/auth/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setStats(data.data);
      })
      .catch((err) => console.log(err));
  }, [token]);

  useEffect(() => {
    socket.on("countdown_tick", ({ timeLeft }) => setCountdown(timeLeft));
    socket.on("time_till_new_session", ({ timeToStart }) =>
      setTimeTillNewSession(timeToStart)
    );
    return () => {
      socket.off("countdown_tick");
      socket.off("time_till_new_session");
    };
  }, []);

  const joinGame = () => {
    if (!countdown) return showError("There is currently no active session");
    socket.emit("join_game", { token, name: user?.userName });
    router.push("/game");
  };

  return (
    <main className="h-screen relative bg-gray-300">
      <div className=" absolute right-10 top-10 flex flex-col  justify-center gap-4 px-8 text-center">
        <p className="capitalize">Hi {user?.userName}</p>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center h-full">
        {stats?.wins ? (
          <div className="  flex flex-col gap-4 items-center justify-center h-full">
            <p className=" uppercase font-bold">Total wins : {stats?.wins}</p>

            <p className=" uppercase font-bold">
              Total Losses: {stats?.losses}
            </p>

            <button
              onClick={joinGame}
              className="px-4 py-1.5 bg-black font-semibold hover:bg-[#555] transition-all cursor-pointer capitalize text-white min-w-[150px]"
            >
              join
            </button>

            <p className="text-red-500">
              {countdown
                ? `There is an active session you can join in ${countdown} s`
                : "There is currently no active session"}
            </p>
            <p className="text-red-500">
              {timeTillNewSession
                ? `new session starts in ${timeTillNewSession} s`
                : ""}
            </p>
          </div>
        ) : (
          <ClipLoader />
        )}
      </div>
    </main>
  );
};

export default Page;
