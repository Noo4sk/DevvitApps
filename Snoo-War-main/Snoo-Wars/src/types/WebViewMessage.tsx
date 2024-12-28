import { PlayerState } from './playerState.js';


// Defines the messages that are exchanged between Devvit and Web View
export type WebViewMessage =
  | {
      type: 'initialData';
      data: { id: string, username: string; snooImage: string, playState: PlayerState, playerList: string};
    }
  | {
      type: 'updateRedis';
      data: {
        state: any,
        id: string
      }
    }