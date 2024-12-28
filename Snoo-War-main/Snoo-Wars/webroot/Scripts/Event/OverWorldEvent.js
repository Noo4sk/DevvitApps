class OverWorldEvent{
    constructor({map, event}){
        this.map = map;
        this.event = event;
    }
    
    updateRedis(resolve){
        this.map.overworld.progress.save();
        resolve();
    }

    pause(resolve){
        this.map.isPaused = true;

        const menu = new PauseMenu({
            progress: this.map.overworld.progress,
            onComplete: () => {
                this.map.isPaused = false;
                this.map.overworld.startGameLoop();
                resolve();
            }
        });
        menu.init(document.querySelector(".game-container"));
    }

    updateStoryProgress(resolve){
        window.playerState.progress.amount += 1;
        resolve();
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


    ChangeCamera(resolve){
        const who = this.map.gameObjects[this.event.who];
        this.map.overworld.cameraPerson = who;

        resolve()
    }

    textMessage(resolve){

        if(this.event.facePlayer){
            const obj = this.map.gameObjects[this.event.facePlayer];
            obj.direction = utils.oppositeDirection(this.map.gameObjects['player'].direction);
        }

        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve(),
            actor: this.event.actor
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
       // window.snoo_war_Audio_bgm.src = "./assets/Audio/SLOWEST_TEMPO_Retro_Platforming_David_Fesliyan.mp3";

        
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


    battlePvp(resolve){
        console.groupCollapsed(`BattlePvp: ${Math.floor(Math.random() * 101)}`);
        const keys = Object.keys(Enemies);

        Logging.log(`Current keys:\n\n${keys}`);
        
        let index = keys.indexOf(window.playerId)
        Logging.log(`find ME Index: ${index}`);

        if(index != -1){
            keys.splice(index, 1);
            Logging.log(`List without ME: ${keys}`);
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

        window.AudioBgm.src = "./assets/Audio/SLOWEST_TEMPO_Retro_Platforming_David_Fesliyan.mp3";
        window.AudioBgm.play()

        Logging.logObject({
            name: `Random Enemies Selected`,
            object: Enemies[randomKey],
            extraItems: [
                `Enemies[${randomKey}]`
            ]
        });

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
            
            window.isInBattle = true;
            console.log(`is in battle: ${window.isInBattle}`);
            
            battle.init(document.querySelector(".game-container"));
        });


        console.groupEnd();
    }


// ===================================== Snoo Actions ===========================================================================
    healSnoo(resolve){
        Object.keys(window.playerState.snoo).forEach(key => {
            window.playerState.snoo[key].hp = window.playerState.snoo[key].maxHp;
            EventUtils.emitEvent("PlayerStateUpdated");
        });

        resolve();
    }

    giveAbility(resolve){
        const SnooAbility = window.playerState.heldActions;
        console.log(`Before: ${SnooAbility}`);

        const index = SnooAbility.indexOf(this.event.ability);
        if(index === -1){
            window.playerState.heldActions.push(this.event.ability);
        }

        console.log(`After: ${SnooAbility}`);
        resolve();
    }

    removeAbility(resolve){
        const SnooAbility = window.playerState.heldActions;
        console.log(`Before: ${SnooAbility}`);

        const index = SnooAbility.indexOf(this.event.ability);
        if(index != -1){
            window.playerState.heldActions.splice(index, 1);
        }

        console.log(`After: ${SnooAbility}`);
        resolve();
    }

// ===================================== INIT ===========================================================================
    init(){
        return new Promise(resolve => {
            this[this.event.type](resolve);

        });
    }
}