declare module 'use-y-js' {
  export function useYjs({
    signaling: String,
    roomName: String,
    initData: any,
    initUserInfo: any,
    intervalSyncTime: Number,
  }): any
}