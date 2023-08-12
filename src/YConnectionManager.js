import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

class YConnectionManager {
  constructor() {
    this.yConnectionMap = {};
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        Object.keys(this.yConnectionMap).forEach((signaling) => {
          Object.keys(this.yConnectionMap[signaling]).forEach((roomName) => {
            this._destroyYdoc(signaling, roomName);
          });
        });
      });
    }
  }

  getYConnection(signaling, roomName, params) {
    if (typeof window !== "undefined") {
      if (!this.yConnectionMap[signaling]) {
        this.yConnectionMap[signaling] = {};
      }
      if (!this.yConnectionMap[signaling][roomName]) {
        let yDoc = new Y.Doc();
        let provider = new WebsocketProvider(signaling, roomName, yDoc, {
          params,
        });
        this.yConnectionMap[signaling][roomName] = {
          yDoc,
          provider,
        };
      }
      return this.yConnectionMap[signaling][roomName];
    } else return {};
  }

  leaveRoom(signaling, roomName) {
    if (
      !!this.yConnectionMap[signaling] &&
      !!this.yConnectionMap[signaling][roomName]
    ) {
      this._destroyYdoc(signaling, roomName);
      delete this.yConnectionMap[signaling][roomName];
      if (Object.keys(this.yConnectionMap[signaling]).length === 0) {
        delete this.yConnectionMap[signaling];
      }
    }
  }

  _destroyYdoc(signaling, roomName) {
    if (
      this.yConnectionMap[signaling][roomName].provider.awareness.getStates()
        .size === 1
    ) {
      for (let key of this.yConnectionMap[signaling][roomName].yDoc
        .getMap()
        .keys()) {
        this.yConnectionMap[signaling][roomName].yDoc.getMap().delete(key);
      }
    }
    this.yConnectionMap[signaling][roomName].yDoc.destroy();
  }
}

const Y_CONNECTION_MANAGER = new YConnectionManager();

export default Y_CONNECTION_MANAGER;
