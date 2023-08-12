"use client";
import { useEffect, useRef } from "react";
import User from "./User";
import useCreateUser from "../hooks/useCreateUser";

export default function UserPosition() {
  const { userInfoMap, updateFieldLocalUserInfo, localID } = useCreateUser();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", (e) => {
        
        let x = (e.clientX) / window.outerWidth;
        let y = (e.clientY)/ window.outerHeight;
        updateFieldLocalUserInfo("location", {
          x,
          y,
        });
      });
    }
  }, [updateFieldLocalUserInfo]);

  return (
    <div
      style={{
        backgroundColor: "transparent",
        zIndex: 1000,
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        pointerEvents: "none",
      }}
      id="Draw123"
    >
      {Object.keys(userInfoMap).length &&
        Object.keys(userInfoMap || {})
          .filter((id) => id !== localID && !!userInfoMap[id].location)
          .map((id) => {
            let user = userInfoMap[id];
            let userData = {
              name: user.name,
              color: user.color,
              location: {
                x: window.innerWidth * user.location.x,
                y: window.innerHeight * user.location.y,
              },
            };
            return <User key={id} user={userData} />;
          })}
    </div>
  );
}
