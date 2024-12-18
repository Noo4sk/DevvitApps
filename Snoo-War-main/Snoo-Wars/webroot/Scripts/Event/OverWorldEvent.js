class OverWorldEvent{
    constructor({map, event}){
        this.map = map;
        this.event = event;
    }

    updateRedis(resolve){
        console.log(`Updating Redis`)
        if(!window.State_Testing){
            const jString = JSON.stringify(window.playerState);
            const ID = localStorage.getItem("playerId");
            
            console.log(`
                id: ${ID},
                window.playerState\n ${jString}    
            `);

            //Update Redis Now.
            window.parent?.postMessage({
                type: "updateRedis",
                data: {
                    playerState: jString,
                    id: ID,
                }
            }, '*');
    
            resolve();

        } else {
            console.log('Currently Testing');
            resolve();

        }
    }

    pause(resolve){
        this.map.isPaused = true;

        const menu = new PauseMenu({
            onComplete: () => {
                this.map.isPaused = false;
                this.map.overworld.startGameLoop();
                resolve();
            }
        });
        menu.init(document.querySelector(".game-container"));
    }

    addStoryFlag(resolve){
        window.playerState.storyFlags[this.event.flag] = true;
        resolve();
    }

    stand(resolve){
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior( {
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time
        });

        const completeHandler = e => {
            if(e.detail.whoId === this.event.who){
                document.removeEventListener("PersonStandComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("PersonStandComplete", completeHandler);
    }


    /**
     * 
     * @CallBack completeHandler when person is donw walking, then Resolve Content.
     */
    walk(resolve){

        const who = this.map.gameObjects[this.event.who];
        who.startBehavior( {
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true
        });

        const completeHandler = e => {
            if(e.detail.whoId === this.event.who){
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve()
            }
        }
        document.addEventListener("PersonWalkingComplete", completeHandler);
    }

    textMessage(resolve){

        if(this.event.facePlayer){
            const obj = this.map.gameObjects[this.event.facePlayer];
            obj.direction = utils.oppositeDirection(this.map.gameObjects['player'].direction);
        }

        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        });

        message.init(document.querySelector(".game-container"));
    }

    changeMap(resolve){

        // Deactivate old Objects;
        Object.values(this.map.gameObjects).forEach( obj => {
            obj.isMounted = false;
        });

        const sceneTransition = new SceneTransition();
        sceneTransition.init(document.querySelector(".game-container"), () => {
            this.map.overworld.startMap(window.OverWorldMaps[this.event.map], {
                x: this.event.x,
                y: this.event.y,
                direction: this.event.direction,
            });

            sceneTransition.fadeOut();
            resolve();
        });
    }

    battle(resolve){
        //window.snoo_war_Audio_bgm.src = "./assets/Audio/SLOWEST_TEMPO_Retro_Platforming_David_Fesliyan.mp3";

        
        // TODO MAKE BLINKING SCENE TRANSISTION?
        const sceneTransitionOverWorld = new SceneTransition();
        const battle = new Battle({
            enemy: Enemies[this.event.enemyId],
            onComplete: (didWin) => {
                resolve(didWin ? "Winner" : "Lost");
            }
        });

        sceneTransitionOverWorld.init(document.querySelector(".game-container"), async () => {
            sceneTransitionOverWorld.fadeOut();
            
            battle.init(document.querySelector(".game-container"));
        });


    }


    healSnoo(resolve){
        Object.keys(window.playerState.snoo).forEach(key => {
            window.playerState.snoo[key].hp = window.playerState.snoo[key].maxHp;
            EventUtils.emitEvent("PlayerStateUpdated");

        });

        resolve();
    }

    noBattleFound(){

    }

    battlePvp(resolve){
        window.AudioBgm.src = "./assets/Audio/SLOWEST_TEMPO_Retro_Platforming_David_Fesliyan.mp3";
        window.AudioBgm.play()

        const keys = Object.keys(Enemies);
        console.log(`Current keys: ${keys}`);
        
        let index = keys.indexOf(window.playerId)
        console.log(`Index [If Found]: ${index}`);

        if(index != -1){
            keys.splice(index, 1);
            console.log(`Filter keys: ${keys}`);
        }

        let randomKey = keys[Math.floor(Math.random() * keys.length)];;

        // No Fights Found.
        if (keys.length <= 0){
            
            const message = new TextMessage({
                text: `Oh No.. We couldn't find any battles...`,
                onComplete: () => resolve()
            });
    
            message.init(document.querySelector(".game-container"));

            return;
        }

        console.log(`
            keys: ${keys}
            randomKey: ${randomKey}
            Enemies[${randomKey}]\n${JSON.stringify(Enemies[randomKey])}
        `)

        // TODO MAKE BLINKING SCENE TRANSISTION?
        const sceneTransitionOverWorld = new SceneTransition();
        const battle = new Battle({
            enemy: Enemies[randomKey],
            onComplete: (didWin) => {
                resolve(didWin ? "Winner" : "Lost");
            }
        });

        sceneTransitionOverWorld.init(document.querySelector(".game-container"), async () => {
            sceneTransitionOverWorld.fadeOut();
            
            battle.init(document.querySelector(".game-container"));
        });

    }


    init(){
        return new Promise(resolve => {
            this[this.event.type](resolve)
        });
    }
}