import { Devvit } from '@devvit/public-api';

export function RemoveRedisSave(){
    Devvit.addMenuItem({
        label: 'Remove Redis Save',
        location: 'subreddit', // accepts 'post', 'comment', 'subreddit', or a combination as an array
        forUserType: 'moderator', // restricts this action to moderators, leave blank for any user
        onPress: async (event, context) => {
            const getToRemove = await context.redis.hGetAll("Player_Base")
            
            Object.keys(getToRemove).forEach( async (key) =>{
              console.log(`key: ${key}`);
       
              const numFieldsRemoved = await context.redis.hDel("Player_Base", [key]);
              console.log("Number of fields removed: " + numFieldsRemoved);
            })
        },
      });
}

