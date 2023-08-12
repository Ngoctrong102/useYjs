import { useYjs } from "use-y-js";

export default function useCreateUser() {
  const Y =
    useYjs({
      signaling: "ws://localhost:4444",
      roomName: "create-user-4",
      initData: {},
      initUserInfo: {
        name: "User" + Math.floor(Math.random() * 10),
        color: ["#389e0d", "#08979c", "#0958d9"][Math.floor(Math.random() * 3)],
      },
      intervalSyncTime: 100,
    });

  return Y
}