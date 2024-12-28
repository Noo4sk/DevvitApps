export type PlayerState = {
  playerState: {
    "snoo": {
      [id: string]: {
          name: string,
          snooImage: string,
          id: string,
    
          hp: number,
          maxHp: number,
          
          max_Xp: number,
          xp: number,
          level: number,
          
          attack: number,
          defence: number,
          speed: number,


          heldActions: string[],
          status: {} | null,

          Equipment: {
            head: {},
            chest:  {},
            legs:  {},
            feet:  {},

            ring1:  {},
            ring2:  {},

            rightHand: {},
            leftHand:  {},
          }
      }
    }
    Inventory: object[],

    lineup: string[],
    items: object[],
    storyFlags: {
      [flag: string]: boolean,
    },

    battleWon: number,
    money: number,
    progress: {
      amount: 0,
      mapId: string,
      x: number,
      y: number,
      direction: string,
    }

  }
}