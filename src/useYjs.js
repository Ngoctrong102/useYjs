import { useState, useEffect } from "react";
import * as Y from "yjs";
import Y_CONNECTION_MANAGER from "./YConnectionManager";

export default function useYjs({
  signaling,
  roomName,
  params = {},
  initData = {},
  initUserInfo = {},
  intervalSyncTime = 250,
}) {
  const [ydoc] = useState(
    Y_CONNECTION_MANAGER.getYConnection(signaling, roomName, params).yDoc
  );
  const [data, setData] = useState({
    ...initData,
    ...Object.fromEntries(new Map(ydoc.getMap().entries())),
  });
  const [provider] = useState(
    Y_CONNECTION_MANAGER.getYConnection(signaling, roomName, params).provider
  );

  const [userInfoMap, setUserInfoMap] = useState({});

  const [canSyncAwareness, setCanSyncAwareness] = useState(false);

  useEffect(() => {
    return () => leaveRoom(signaling, roomName);
  }, [signaling, roomName])

  useEffect(() => {
    let syncInterval = setInterval(() => {
      setCanSyncAwareness(true);
    }, intervalSyncTime);
    return () => clearInterval(syncInterval);
  }, [intervalSyncTime]);

  useEffect(() => {
    if (!ydoc.getMap()) {
      Object.keys(initData).forEach((key) => {
        ydoc.getMap().set(key, initData[key]);
      });
    }
  }, [ydoc]);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      ...Object.fromEntries(new Map(ydoc.getMap().entries())),
    }));
  }, [ydoc]);

  useEffect(() => {
    ydoc.on("update", (update) => {
      Y.applyUpdate(ydoc, update);
      setData(Object.fromEntries(new Map(ydoc.getMap().entries())));
    });
  }, [ydoc]);

  useEffect(() => {
    provider.awareness.setLocalState(initUserInfo);
  }, [provider]);

  useEffect(() => {
    provider.awareness.on("change", (changes) => {
      provider._awarenessUpdateHandler(changes);
      setUserInfoMap(Object.fromEntries(provider.awareness.getStates()));
    });
  }, [provider]);

  const updateData = (newData) => {
    Object.keys(newData).forEach((key) => {
      if (newData[key] !== data[key]) {
        ydoc.getMap().set(key, newData[key]);
      }
    });
  };

  const updateFieldData = (fieldName, value) => {
    ydoc.getMap().set(fieldName, value);
  };

  const updateLocalUserInfo = (userInfo) => {
    if (canSyncAwareness) {
      provider.awareness.setLocalState(userInfo);
      setCanSyncAwareness(false)
    }
  };

  const updateFieldLocalUserInfo = (fieldName, value) => {
    if (canSyncAwareness) {
      provider.awareness.setLocalStateField(fieldName, value);
      setCanSyncAwareness(false)
    }
  };

  const leaveRoom = (signaling, roomName) => {
    Y_CONNECTION_MANAGER.leaveRoom(signaling, roomName)
  }

  return {
    data: data,
    updateData,
    updateFieldData,
    localID: provider.awareness.clientID.toString(),
    localUserInfo: provider?.awareness?.getLocalState(),
    userInfoMap,
    updateLocalUserInfo,
    updateFieldLocalUserInfo,
  };
}
