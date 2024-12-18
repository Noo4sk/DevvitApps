class OverWorldMap {
    constructor(config){
        this.overworld = null;

        this.gameObjects = {}; // Live
        this.configObjects = config.configObjects; // Object Config for Live Objects


        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
  

        this.isCutscenePlaying = false;
        this.isPaused = false;

        this.showWalls = false;
        this.wallsImage = new Image();
        this.wallsImage.src = "./assets/Maps/wall-Image.png";
    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(this.lowerImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        );
    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage, 
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        );
    }

    mountObjects(){
        Object.keys(this.configObjects).forEach( key => {
            let object = this.configObjects[key];
            object.id = key;

            let instance;
            if(object.type === "person"){
                instance = new Person(object);
            }

            this.gameObjects[key] = instance;
            this.gameObjects[key].id = key;

            instance.mount(this);
        });
    }

    /**
     * @param {number} currentX - Current X of Person.
     * @param {number} currentY - Current Y of Person.
     * @param {string} direction - Direction of the Object.
     * @return The wall if contains key of x,y or returns false
    */
    isSpaceTaken(currentX, currentY, direction){
        const {x, y} = utils.nextPosition(currentX, currentY, direction);
        if(this.walls[`${x},${y}`]){
            return true;
        }

        //check for game Objects 
        return Object.values(this.gameObjects).find(obj => {
            if(obj.x === x && obj.y === y){ return true; }

            if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition === y){
                return true;
            }

            return false;
        });
    }


    async startCutscene(events){
        this.isCutscenePlaying = true;

        // start loop of  async event 
        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverWorldEvent({
                event: events[i],
                map: this,
            });

            // await each one. 
            const result = await eventHandler.init();
            if (result === "Lost"){
                break;
            }
        }

        this.isCutscenePlaying = false;
          
        Object.values(this.gameObjects).forEach( obj => obj.doBehaviorEvent(this));

    }


    checkForActionCutscene(){
        const player = this.gameObjects["player"];
        const nextCoords = utils.nextPosition(player.x, player.y, player.direction);

        const match = Object.values(this.gameObjects).find(obj => {
            return `${obj.x},${obj.y}` === `${nextCoords.x},${nextCoords.y}`;
        });
        if(!this.isCutscenePlaying && match && match.talking.length){


            const relScenario = match.talking.find(scenario => {

                return (scenario.required || []).every( sf => {
                    return playerState.storyFlags[sf];
                });
            });
            relScenario && this.startCutscene(relScenario.events);

        }
    }

    checkForFootStepCutscene(){
        const player = this.gameObjects["player"];
        const match = this.cutsceneSpaces[`${player.x},${player.y}`];
        
        if(!this.isCutscenePlaying && match){

            const relScenario = match.find(scenario => {
                return (scenario.events[0].required || []).every( sf => {
                    return playerState.storyFlags[sf];
                });
            });

            relScenario && this.startCutscene(relScenario.events);
        }
    }

    drawWall(ctx, cameraPerson, x, y){
        ctx.drawImage(
            this.wallsImage, 
            x + utils.withGrid(10.5) - cameraPerson.x,
            y + utils.withGrid(6) - cameraPerson.y
        );
    }
}

window.OverWorldMaps = {
    Street: {
        id: "Street",
        lowerSrc: "./assets/Maps/StreetLower.png",
        upperSrc: "./assets/Maps/StreetUpper.png",
        configObjects: {
            player: {
                type: "person",
                isPlayerControlled: true,
                x: utils.withGrid(20),
                y: utils.withGrid(8),
            },
            npcA: {
                type: "person",
                x: utils.withGrid(19),
                y: utils.withGrid(6),
                src: "./assets/Characters/Woof/s5-2-wolf-Sheet-walk.png",
                behaviorLoop: [
                    {type: "stand", direction: "down"},
                ],
                talking: [
                   {
                    events: [
                        { type: "textMessage", text: "Need More Health?", facePlayer: "npcA"},
                        { type: "healSnoo" }
                    ]
                   }
                ]
            },
        },
        walls: {
            
        },
        cutsceneSpaces: {
            [utils.asGridCoord(26, 7)]: [
                {
                    events: [
                        { 
                            type: "changeMap", 
                            map: "Store_1",
                            x: utils.withGrid(3),
                            y: utils.withGrid(7),
                            direction: "up",
                        },
                    ]
                }
            ],
            [utils.asGridCoord(20, 5)]: [
                {
                    
                    events: [
                        { type: "battlePvp" },
                        { who: "player", type: "walk", direction: "down", },
                    ]
                }
            ],
            [utils.asGridCoord(2, 7)]: [
                {
                    events: [
                        { 
                            type: "changeMap", 
                            map: "spawn",
                            x: utils.withGrid(3),
                            y: utils.withGrid(7),
                            direction: "up",
                        },
                    ]
                }
            ]
        }
    },
    Store_1: {
        id: "Store_1",

        lowerSrc: "./assets/Maps/shop_lower.png",
        upperSrc: "./assets/Maps/shop_upper.png",
        configObjects: {
            player: {
                type: "person",
                isPlayerControlled: true,
                x: utils.withGrid(3),
                y: utils.withGrid(6)
            },
            npcA:  {
                type: "person",
                x: utils.withGrid(8),
                y: utils.withGrid(4),
                src: "./assets/Characters/Woof/s5-2-wolf-Sheet-walk.png",
                behaviorLoop: [],
                talking: [
                   {
                    events: [
                        {type: "textMessage", text: "Well your inside now?", facePlayer: "npcA"}
                    ],
                   }
                ],
            },
        },
        walls: {
            [utils.asGridCoord(0, 3)]: true, [utils.asGridCoord(0, 4)]: true, [utils.asGridCoord(0, 5)]: true, 
            [utils.asGridCoord(0, 6)]: true, [utils.asGridCoord(0, 7)]: true, 

            [utils.asGridCoord(1, 2)]: true, [utils.asGridCoord(1, 4)]: true, [utils.asGridCoord(1, 8)]: true, 
            
            [utils.asGridCoord(2, 2)]: true, [utils.asGridCoord(2, 4)]: true, [utils.asGridCoord(2, 8)]: true, 

            [utils.asGridCoord(3, 2)]: true, [utils.asGridCoord(3, 4)]: true, [utils.asGridCoord(3, 9)]: true, 

            [utils.asGridCoord(4, 2)]: true, [utils.asGridCoord(4, 4)]: true, [utils.asGridCoord(4, 8)]: true,

            [utils.asGridCoord(5, 2)]: true, [utils.asGridCoord(5, 4)]: true, [utils.asGridCoord(5, 8)]: true, 

            [utils.asGridCoord(6, 2)]: true, [utils.asGridCoord(6, 4)]: true, [utils.asGridCoord(6, 8)]: true,

            [utils.asGridCoord(7, 2)]: true, [utils.asGridCoord(7, 8)]: true, 

            [utils.asGridCoord(8, 3)]: true, [utils.asGridCoord(8, 8)]: true,

            [utils.asGridCoord(9, 3)]: true, [utils.asGridCoord(9, 8)]: true, 

            [utils.asGridCoord(10, 4)]: true, [utils.asGridCoord(10, 5)]: true, [utils.asGridCoord(10, 6)]: true, 
            [utils.asGridCoord(10, 7)]: true, 

        },
        cutsceneSpaces: {
            [utils.asGridCoord(9, 7)]: [
                {
                    events: [
                        {type: "textMessage", text: "Well yes that is a wall...."},
                    ]
                }
            ],
            [utils.asGridCoord(3, 8)]: [
                {
                    events: [
                        { 
                            type: "changeMap", 
                            map: "Street",
                            x: utils.withGrid(26),
                            y: utils.withGrid(8),
                            direction: "down",
                        },
                    ]
                }
            ]
        }
    },
    spawn: {
        id: "spawn",

        lowerSrc: "./assets/Maps/shop_lower.png",
        upperSrc: "./assets/Maps/shop_upper.png",
        configObjects: {
            player: {
                type: "person",
                isPlayerControlled: true,
                x: utils.withGrid(3),
                y: utils.withGrid(6)
            },
            npcA: {
                type: "person",
                x: utils.withGrid(8),
                y: utils.withGrid(4),
                src: "./assets/Characters/Woof/s5-2-wolf-Sheet-walk.png",
                behaviorLoop: [],
                talking: [
                   {
                    events: [
                        {type: "textMessage", text: "This Game Is Under Devlopment By Noo-Ask. Have Fun and look Around", facePlayer: "npcA"}
                    ],
                   }
                ],
            },
            npcB:  {
                type: "person",
                x: utils.withGrid(3),
                y: utils.withGrid(3),
                src: "./assets/Characters/Woof/s5-2-wolf-Sheet-walk.png",
                behaviorLoop: [],
                talking: [
                    {   
                        required: ["Battle_Won_001"],
                        events: [
                            { type: "textMessage", text: "I Guess your Looks is Ok..", facePlayer: "npcB" },                  
                        ],
                    },
                   {
                        events: [
                            { type: "textMessage", text: "I dont like your look", facePlayer: "npcB" },
                            { type: "textMessage", text: "Well I dont like your look"},
                            { type: "addStoryFlag", flag: "Battle_Won_001" },
                            // { type: "battle", enemyId: "Tester" },
                            // { type: "updateRedis" },
                        ],
                   }
                ],
            },
        },
        walls: {
            [utils.asGridCoord(0, 3)]: true, [utils.asGridCoord(0, 4)]: true, [utils.asGridCoord(0, 5)]: true, 
            [utils.asGridCoord(0, 6)]: true, [utils.asGridCoord(0, 7)]: true, 

            [utils.asGridCoord(1, 2)]: true, [utils.asGridCoord(1, 4)]: true, [utils.asGridCoord(1, 8)]: true, 
            
            [utils.asGridCoord(2, 2)]: true, [utils.asGridCoord(2, 4)]: true, [utils.asGridCoord(2, 8)]: true, 

            [utils.asGridCoord(3, 2)]: true, [utils.asGridCoord(3, 4)]: true, [utils.asGridCoord(3, 9)]: true, 

            [utils.asGridCoord(4, 2)]: true, [utils.asGridCoord(4, 4)]: true, [utils.asGridCoord(4, 8)]: true,

            [utils.asGridCoord(5, 2)]: true, [utils.asGridCoord(5, 4)]: true, [utils.asGridCoord(5, 8)]: true, 

            [utils.asGridCoord(6, 2)]: true, [utils.asGridCoord(6, 4)]: true, [utils.asGridCoord(6, 8)]: true,

            [utils.asGridCoord(7, 2)]: true, [utils.asGridCoord(7, 8)]: true, 

            [utils.asGridCoord(8, 3)]: true, [utils.asGridCoord(8, 8)]: true,

            [utils.asGridCoord(9, 3)]: true, [utils.asGridCoord(9, 8)]: true, 

            [utils.asGridCoord(10, 4)]: true, [utils.asGridCoord(10, 5)]: true, [utils.asGridCoord(10, 6)]: true, 
            [utils.asGridCoord(10, 7)]: true, 

        },
        cutsceneSpaces: {
            [utils.asGridCoord(9, 7)]: [
                {
                    events: [
                        {type: "textMessage", text: "Well yes that is a wall...."},
                    ]
                }
            ],
            [utils.asGridCoord(3, 8)]: [
                {
                    events: [
                        { 
                            required: ["Battle_Won_001"],
                            type: "changeMap", 
                            map: "Street",
                            x: utils.withGrid(2),
                            y: utils.withGrid(8),
                            direction: "down",

                        },
                        { type: "updateRedis" },          

                    ]
                },
                {
                    events: [
                        { who: "npcB", type: "walk", direction: "down", },
                        { type: "textMessage", text: "I dont like your look"},
                        { who: "npcB", type: "walk", direction: "up", },
                        { who: "npcB", type: "stand", direction: "down", time: 100, },


                    ],
                }
            ],
        }
    },
}