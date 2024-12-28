import { PlayerState } from "../types/playerState.js";
import { Devvit } from '@devvit/public-api';

async function getPlayer(redis_player: string){
    //===================== User was Found ==========================
    let rPlayerObj = JSON.parse(redis_player);

    // check to make sure Object has playerState key
    if(rPlayerObj?.playerState === undefined){
      console.log(`\nNO PlayerState Found Adding...\n`)

      // wrapping playerObject in a playerState object.
      const _playerState = {
        playerState: {
          ...rPlayerObj
        }
      }

      // coverting the object back to string.
      const _playerStateString = JSON.stringify(_playerState, undefined, 2);
      console.log(`New With PlayerState:\n\n ${JSON.stringify(_playerState, undefined, 2)}\n`);

      // returning the player as a string.
      return _playerStateString;

    } else {

      //============ Player Has a player State Wrapper ==============
      // coverting to string.
      const rPlayerString = JSON.stringify(rPlayerObj, undefined, 2);
      console.log(`Redis: player was found... using that User\n`);
      console.log(`${rPlayerString}\n`);

      // Returning player as a string.
      return rPlayerString;
    }
}

async function newPlayer(context: Devvit.Context, userID: string, username: string, SnooImage: string){
    console.log(`redis_player was not found... creating User\n`);
  
    // If a userID is not proper lets return player as anon.
    if(userID === "anon" || userID === "ID"){
      return 'anon';
    }
  
    // Create new playerState.
    const playerState: PlayerState = {
        playerState: {
          "snoo": {
              [userID]: {
                name: username,
                snooImage: SnooImage,
                id: userID,

                level: 1,

                hp: 30,
                maxHp: 30,

                xp: 0,
                max_Xp: 100,

                attack: 0,
                defence: 0,
                speed: 0,

                status: {},
                heldActions: ['whomp'],
                Equipment: {
                  head: {
                    name: 'Starter Cap', attack: 0, defence: 1, ability: {}
                  },
                  chest:  {
                    name: 'Plain Shirt', attack: 0, defence: 1, ability: {}
      
                  },
                  legs:  {
                    name: 'Plain Pants', attack: 0, defence: 1, ability: {}
      
                  },
                  feet:  {
                    name: 'Starter Boots', attack: 0, defence: 1, ability: {}
      
                  },
      
                  ring1:  {
      
                  },
                  ring2:  {
      
                  },
      
                  rightHand: {
                    name: 'Wooden Sword', attack: 1, defence: 0, ability: {}
                  },
                  leftHand:  {
      
                  },
                }
              }
            },
            Inventory: [
              {name:'test1', description: 'Test item 1 Desc', attack: 1, defence: 1, speed: 1, stack: 1},
              {name:'test2', description: 'Test item 2 Desc', attack: 1, defence: 1, speed: 1, stack: 1},
              {name:'test3', description: 'Test item 3 Desc', attack: 1, defence: 1, speed: 1, stack: 1},
            ],


            lineup: [userID],
            items: [],
            storyFlags: {},

            battleWon: 0,
            money: 0,
            progress: {
              amount: 0,

              mapId: 'Street',
              x: 320,
              y: 128,
              direction: 'down',
            }, 
        }
    }
  
    // Convert PlayerState to String.
    const playerStateString = JSON.stringify(playerState, undefined, 2);

    // Save the player Data to player base
    let check = await context.redis.hSet("Player_Base", { [userID]: playerStateString});
    console.log(`Number added to 'Player_Base': ${check}\n`);

    // once save we will return the player string back to devvit.
    console.log(`Returing Current Player\n`);
    console.log(`${playerStateString}\n`);

    return playerStateString;
  }

export { getPlayer, newPlayer }