"use client";

import { useEffect, useState } from "react";
import SocketHandler from "@/utils/socket";
import IUser from "@/Interface/user.interface";
import { showError, showInfo, showSuccess } from "@/utils/helpers";
const socket = SocketHandler.getSocketInstance();

const Page = () => {
  const [token, setToken] = useState<string | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(null);
  const [timeTillNewSession, setTimeTillNewSession] = useState(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [submittedAnswer, setSubmittedAnswer] = useState<string>("");
  const [user, setUser] = useState<IUser | null>(null);

  const [winners, setWinners] = useState<
    {
      username: string;
    }[]
  >([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user");

    setToken(storedToken);
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  useEffect(() => {
    socket.on("session_start", () => {
      setWinningNumber(null);
      setUserAnswer("");
      setSubmittedAnswer("");
      setCountdown(null);
      setWinners([]);
      socket.emit("join_game", { token, name: user?.userName });
    });
    socket.on("session_end", ({ answer, winners }) => {
      setWinningNumber(answer);

      const userInWinners = winners.find(
        (winner: { username: string }) => winner.username === user?.userName
      );

      if (userInWinners) {
        showSuccess("You won", 2000);
      } else {
        showError("You Lost", 2000);
      }
      setWinners(winners);
    });

    socket.on("numOfPlayers", ({ count }) => {
      setPlayerCount(count);
    });

    socket.on("countdown_tick", ({ timeLeft }) => {
      setCountdown(timeLeft);
      console.log(timeLeft);
    });
    socket.on("time_till_new_session", ({ timeToStart }) =>
      setTimeTillNewSession(timeToStart)
    );

    return () => {
      socket.off("numOfPlayers");
      socket.off("countdown_tick");
      socket.off("playerCount");
      socket.off("session_end");
      socket.off("session_start");
    };
  }, [token, playerCount, user]);

  const handleSubmit = () => {
    if (!countdown) return showInfo("Session has ended");
    if (!userAnswer) return showError("Please put in a number");
    setSubmittedAnswer(userAnswer);
    socket.emit("user_answer", { token, number: userAnswer });
  };

  return (
    <main className="h-screen bg-gray-300">
      <>
        {winningNumber || !countdown ? (
          <div className="flex border h-full">
            <div className="flex-1 flex flex-col justify-center h-full">
              <div className="flex items-center justify-center flex-col gap-4">
                <p>Result</p>
                <p className="text-xl font-semibold">{winningNumber}</p>
              </div>

              <div className="flex mt-20 flex-col gap-3 items-center justify-center">
                <p className="capitalize">total players : {playerCount}</p>
                <p className="capitalize">total wins : {winners.length}</p>
                <p className="text-red-500">
                  new session starts in {timeTillNewSession}{" "}
                </p>
              </div>
            </div>
            <div className="bg-gray-500">
              <h4 className="text-lg capitalize font-semibold mt-10 text-green-500 min-w-[300px] text-center">
                winners
              </h4>

              {!!winners.length ? (
                <div className="flex items-center mt-20 flex-col gap-4 text-lg">
                  {winners.map((winner) => (
                    <p className="text-white" key={winner.username}>
                      {winner.username}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-center text-white mt-10">
                  There are no winners in this session
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="relative h-full">
            <div className=" absolute right-10 top-10 flex flex-col  justify-center gap-4 px-8 text-center">
              <p className="capitalize">countdown timer</p>
              <p className="text-lg font-semibold">
                {countdown ? `${countdown}` : "Game not started yet"}{" "}
              </p>
            </div>
            <div className="  flex flex-col gap-4 items-center justify-center h-full">
              <p className="text-lg  ">Pick a random number from 1 - 9</p>
              <p className="">Your Answer :{submittedAnswer}</p>
              <input
                type="number"
                className="border focus:outline-none placeholder:font-normal min-w-[300px] rounded-lg px-4 py-1.5 font-semibold placeholder:text-[#555] text-sm"
                placeholder="Put in a number"
                min={1}
                max={9}
                value={userAnswer}
                onChange={(e) => {
                  if (e.target.value.length > 1) return;
                  setUserAnswer(e.target.value);
                }}
              />
              <button
                onClick={handleSubmit}
                className="bg-[#000] hover:bg-[#555] font-semibold transition-all cursor-pointer min-w-[300px] px-3 py-1.5 text-white"
              >
                Enter
              </button>
              <p className="text-green-500">{playerCount} users joined</p>
            </div>
          </div>
        )}
      </>
    </main>
  );
};

export default Page;
