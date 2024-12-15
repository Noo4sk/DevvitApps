import './createPost.js';

import { Devvit, useState } from '@devvit/public-api';

type PlayerState = {
  playerState: {
    "snoo": {
      [id: string]: {
          snooImage: string,
          id: string,
    
          hp: number,
          maxHp: number,
          max_Xp: number,
          xp: number,
          level: number,
    
          status: {} | null,
      }
    }
    "lineup": string[],
    "items": object[],
    "heldActions": string[]
  }
}

// Defines the messages that are exchanged between Devvit and Web View
type WebViewMessage =
  | {
      type: 'initialData';
      data: { id: string, username: string; snooImage: string, playState: PlayerState};
    }
  | {
      type: 'updateRedis';
      data: { 
        playerState: any
      }
    }

Devvit.configure({
  redditAPI: true,
  redis: true,
  realtime: true,
});


// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'SnooWar',
  height: 'tall',
  render: (context) => {
    // Load username with `useAsync` hook
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? 'anon';
    });

    const [userID] = useState(async () => {
      const userID = context.userId;
      return userID ?? 'anon';
    });

    const [SnooImage] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();

      let SnooUrl = await currUser?.getSnoovatarUrl()
      return SnooUrl ?? 'anon';
    });


    const [player] = useState(async () => {
      //await context.redis.del(userID);

      const redis_player = await context.redis.get(userID) || 'anon';
      if (redis_player === 'anon'){
        console.log(`redis_player was not found... creating User`);

        const _player: PlayerState = {
          playerState: {
            "snoo": {
              [userID]: {
                snooImage: SnooImage,
                id: userID,
                hp: 30,
                maxHp: 30,
                xp: 0,
                max_Xp: 100,
                level: 1,
                status: {},
              }
            },
            lineup: [],
            items: [],
            heldActions: ['damage1']
          }
        }
        let check = await context.redis.set(userID, JSON.stringify(_player)) || 'failed';
        console.log(`Saving To Redis: ${check}`);

        return JSON.stringify(_player);
      }
      
      let rPlayerObj = JSON.parse(redis_player);

      // check to make sure Object has playerState key
      if(rPlayerObj?.playerState === undefined){
        console.log(`NO PlayerState Found Adding...`)
        const _playerState = {
          playerState: {
            ...rPlayerObj
          }
        }
        let _playerStateString = JSON.stringify(_playerState);
        console.log(`_playerState:\n${_playerStateString}\n`);

        return _playerStateString;

      } else {
        let rPlayerString = JSON.stringify(rPlayerObj);
        console.log(`rPlayer:\n${rPlayerString}\n`);
        console.log(`redis_player was found... using User`);

        return rPlayerString;
      }
    });

    // Create a reactive state for web view visibility
    const [webviewVisible, setWebviewVisible] = useState(false);

    // When the web view invokes `window.parent.postMessage` this function is called
    const onMessage = async (msg: WebViewMessage) => {
      switch (msg.type) {
        case 'updateRedis':
          const updateToObj = JSON.parse(msg.data.playerState)
          console.log(`Message received...\n=====\n ${JSON.stringify(updateToObj)} \n=====\n`);
          const check = await context.redis.set(userID, JSON.stringify(updateToObj)) || 'failed';

          console.log(`updateRedis: Updated | ${check}`);
          break;

        case 'initialData':
        default:
          throw new Error(`Unknown message type: ${msg}`);
      }
    };

    // When the button is clicked, send initial data to web view and show it
    const onShowWebviewClick = () => {
      setWebviewVisible(true);

      context.ui.webView.postMessage('SnooWar', {
        type: 'initialData',
        data: {
          playState: player,
          id: userID,
          username: username,
          snooImage: SnooImage
        },
      });
    };

    // Render the custom post type
    return (
      <vstack grow padding="small">
        <vstack
          grow={!webviewVisible}
          height={webviewVisible ? '0%' : '100%'}
          alignment="middle center"
        >
          <text size="xlarge" weight="bold">
            Snoo Wars!
          </text>
          <spacer />
          <vstack alignment="start middle">
            <hstack>
              <text size="medium">Username:</text>
              <text size="medium" weight="bold">
                {' '}
                {username ?? ''}
              </text>
            </hstack>
          </vstack>
          <spacer />
          <button onPress={onShowWebviewClick}>Launch App</button>
        </vstack>
        <vstack grow={webviewVisible} height={webviewVisible ? '100%' : '0%'}>
          <vstack border="thick" borderColor="black" height={webviewVisible ? '100%' : '0%'}>
            <webview
              id="SnooWar"
              url="page.html"
              onMessage={(msg) => onMessage(msg as WebViewMessage)}
              grow
              height={webviewVisible ? '100%' : '0%'}
            />
          </vstack>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
