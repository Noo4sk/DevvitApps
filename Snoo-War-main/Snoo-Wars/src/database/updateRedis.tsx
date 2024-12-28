import { Devvit } from "@devvit/public-api";

export async function updateRedis(context: Devvit.Context, msg: any){
    // Reterive Player_Base from Redis
    const playerList = await context.redis.hGetAll("Player_Base");
    const playerListString = JSON.stringify(playerList, undefined, 2)
    
    // if playerlist is not found Bail.
    if(!playerList){
      console.log('Failed To get Players List...');
      return;
    }
    //console.log(`PlayerList Obj:\n ${playerListString}`);

    //================ if the message data is empty if not update the user.===================
    if(Object.keys(msg.data).length > 0){
      console.log(`\nReceived From WebApp\n`);
      console.log('Saving Player Data\n');
          
      // get the user data who Submitted the request
      const updateToObj = JSON.parse(msg.data.playerState)      
      const add = {
        playerState: {
          ...updateToObj
        }
      }

      console.log(`${JSON.stringify(add)}\n`);
      // Add user data to the PLayer_base with the Key of ID.
      const check = await context.redis.hSet("Player_Base", { [msg.data.id]: JSON.stringify(add) });
    
      console.log(`updateRedis: Updated ${check} Item`);
    }


    //================ Repush the new Data base. ===================
    //console.log(`pushing to webApp`)
    
    // send the update back to WebApp.
    context.ui.webView.postMessage('SnooWar', {
      type: 'updateRedis',
      data: { 
        id: msg.data.id,
        playerList: playerListString,
      }
    });
}
