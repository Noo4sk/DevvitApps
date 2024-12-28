import './createPost.js';

import { Devvit, useChannel, useState } from '@devvit/public-api';
import { RemoveRedisSave } from './Utils/removeRedisSave.js';
import { WebViewMessage } from './types/WebViewMessage.js';
import { updateRedis } from './database/updateRedis.js';
import { getPlayer, newPlayer } from './database/player.js';

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

    // ==================== USER INFO ====================

    // Return the Username of the user.
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? 'anon';
    });


    //  Return the ID of the user.
    const [userID] = useState(async () => {
      const userID = context.userId;
      return userID ?? 'anon';
    });

    // Returns the Snoo image of the user. 
    const [SnooImage] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();

      let SnooUrl = await currUser?.getSnoovatarUrl()
      return SnooUrl ?? 'anon';
    });

    // ============== Get the Player From Database.. ==============
    const [player] = useState(async () => {
      // Get The redis_player as String from Redis "Player_Base" Using User ID.
      const redis_player = await context.redis.hGet("Player_Base", userID);

      // if undefind there is no player So lets Make one.
      if (redis_player === undefined){
        return await newPlayer(context, userID, username, SnooImage);
      
      } else {
        return await getPlayer(redis_player);

      }

    });

    // ============== Return a list of all players in the Data base. ==============
    const [PlayerList] = useState(async () => {
      
      const players = await context.redis.hGetAll("Player_Base");

      if(Object.keys(players).length > 0){
        return JSON.stringify(players);
      }

      return 'anon';
    });


    // Create a reactive state for web view visibility
    const [webviewVisible, setWebviewVisible] = useState(false);

    // When the web view invokes `window.parent.postMessage` this function is called
    const onMessage = async (msg: WebViewMessage) => {
      switch (msg.type) {
        
        // Message Recived from WebApp With type of 'updateRedis' 
        case 'updateRedis':
          await updateRedis(context, msg);
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
          snooImage: SnooImage,
          playerList: PlayerList, 
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


RemoveRedisSave();

export default Devvit;
