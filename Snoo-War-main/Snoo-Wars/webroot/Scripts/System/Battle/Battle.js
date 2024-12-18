class Battle {


    constructor(
        { enemy, onComplete }
    ){
        this.onComplete = onComplete;
        this.combatants = {};

        this.enemyID;
        this.enemy = enemy;

        console.log(`[Battle: 13] Enemy:\n${JSON.stringify(this.enemy, undefined, 2)}`);
        
        this.activeCombatants = {
            player: null, //'playerSnoo',
            enemy: null //'enemySnoo'
        };

        // Dynamically Adding the player Team
        window.playerState.lineup.forEach( id => {
            this.addCombatant(
             id,
             "player",
             window.playerState.snoo[id],
            );
        });


        Object.keys(this.enemy.snoo).forEach( key => {
            console.log(`Key: ${key},\nsnoo: ${JSON.stringify(this.enemy.snoo[key], undefined, 2)}`);

            this.enemyID = this.enemy.snoo[key].id
            this.addCombatant(
                key,
                "enemy",
                this.enemy.snoo[key],
               );
        });

        this.items = [];
        window.playerState.items.forEach( item => {
            this.items.push({
                ...item,
                team: "player",
            });
        });

        this.usedInstanceIds = {

        };
    }

    createElement() {

        this.element = document.createElement("div");
        this.element.classList.add("Battle");
        this.element.innerHTML = (`
            <div class="battle_Player">
                <img src="${`./assets/Characters/Cat/s5-2-cat-Sheet-walk.png`}" alt="PlayerSnoo" />
            </div>
            <div class="battle_Enemy">
               <!-- <img src="${this.enemy.snoo[this.enemyID].snooImage}" alt=${this.enemy.playerName} /> -->
            </div>
        `);
    }

    addCombatant(id, team, config){
        console.log(JSON.stringify({
            ...Snoo[config.id],
            ...config,
            team,
            isPlayerControlled: team === "player",
        }, undefined, 2));

        this.combatants[id] = new Combatant({
            ...Snoo[config.id],
            ...config,
            team,
            isPlayerControlled: team === "player",

        }, this);
        this.activeCombatants[team] = this.activeCombatants[team] || id;

    }

    async init(container){
        //await utils.wait(1000);
        this.createElement();
        container.appendChild(this.element);

        Object.keys(this.combatants).forEach( key => {
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element);
        });

        this.turnCycle = new TurnCycle({
            battle: this,
            onNewEvent: event => {
                return new Promise(resolve => {
                    const battleEvent = new BattleEvent(event, this);
                    battleEvent.init(resolve);
                });
            },
            onWinner: winner => {
                const sceneTransitionOverWorld = new SceneTransition();
                
                if(winner === "player"){
                    const playerState = window.playerState;
                    Object.keys(playerState.snoo).forEach( id => {
                        const playerStateSnoo = playerState.snoo[id];
                        const combatant = this.combatants[id];
                        if (combatant){
                            playerStateSnoo.hp = combatant.hp;
                            playerStateSnoo.xp = combatant.xp;
                            playerStateSnoo.max_Xp = combatant.max_Xp;
                            playerStateSnoo.level = combatant.level;
                        }
                    });

                    // remove player used items;
                    playerState.items = playerState.items.filter(item => {
                        return !this.usedInstanceIds[item.instanceId];
                    });

                    EventUtils.emitEvent("PlayerStateUpdated");

                }

                sceneTransitionOverWorld.init(document.querySelector(".game-container"), async () => {
                    sceneTransitionOverWorld.fadeOut();
                    
                    window.AudioBgm.src = "./assets/Audio/8_Bit_Menu_David_Renda.mp3";
                    window.AudioBgm.play();

                    this.element.remove();
                    this.onComplete(winner === "player");

                });
            }
        });
        this.turnCycle.init();
    }
}

