# useYjs
A custom hook simplifies to create of a CRDT document.

## Manual
1.Start a signaling y-websocket server
```
PORT=4444 npx y-websocket
```

*Read more: [y-websocket](https://github.com/yjs/y-websocket)*

2.Intall use-y-js
```
npm install use-y-js
```

3.Import hook and start coding

```js
import { useYjs } from "use-y-js";
// ...
const { data, updateData, userInfoMap, updateFieldLocalUserInfo } = useYjs({
  signaling: "ws://localhost:4444",
  roomName: "your-room-name",
  // use for auth
  params: {
    token: "anthing"
  }
  // POJO
  initData: {
    title: "Doc title",
    content: "Doc content"
  },
  // POJO
  initUserInfo: {
    name: "Rio",
    color: "#166f9c",
    pointerLocation:  {
      x: 100,
      y: 200
    }
  },
  // Minimum time until the next userInfo data sync, defaultValue = 250
  intervalSyncTime: 300
});
```