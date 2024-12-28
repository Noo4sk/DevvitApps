class TurnCycle {
    constructor( {battle, onNewEvent, onWinner} ){
        this.battle = battle;
        this.onNewEvent = onNewEvent;
        this.onWinner = onWinner;
        this.currentTeam = "player";
    }

    async turn(){

        // Who's Turn

        const casterId = this.battle.activeCombatants[this.currentTeam];
        const caster = this.battle.combatants[casterId];

        const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"];
        const enemy = this.battle.combatants[enemyId];

        const submission = await this.onNewEvent({
            type: "submissionMenu",
            enemy,
            caster
        });        

        if(submission.instanceId){
            // persist to player state
            this.battle.usedInstanceIds[submission.instanceId] = true;
            // Remove item from battle state
            this.battle.items = this.battle.items.filter( i => i.instanceId !== submission.instanceId);
        }

        const resultingEvents = submission.action.success;
        console.log(resultingEvents);

        for (let i = 0; i < resultingEvents.length; i++) {
            const event = {
                ...resultingEvents[i],
                submission,
                action: submission.action,
                caster,
                target: submission.target,
            }
            await this.onNewEvent(event);
        }
        console.log(`Uses: ${submission.action.name}`)

        const postEvents = caster.getPostEvents();
        for (let events = 0; events < postEvents.length; events++) {
            const event = {
                ...postEvents[events],
                submission,
                action: submission.action,
                caster,
                target: submission.target,
            }
            await this.onNewEvent(event);
            
        }

        // Did we kill The Target.
        const targetDead = submission.target.hp <= 0;
        if(targetDead){
            console.log(`target Dead: ${submission.target.name}`);

            await this.onNewEvent(
                {type: "textMessage", text: `${submission.target.name} was Defeated.`}
            );

            if(submission.target.team === "enemy"){
                const playerActiveSnooId = this.battle.activeCombatants.player;
                const xp = submission.target.givesXp;
                const money = Number(submission.target.givesMoney);

                await this.onNewEvent({
                    type: "textMessage",
                    text: `Gained ${xp} xp and $${money.toLocaleString()}`
                });
                await this.onNewEvent({
                    type: "giveXp",
                    xp,
                    combatant: this.battle.combatants[playerActiveSnooId]
                });
                await this.onNewEvent({
                    type: "giveMoney",
                    money,
                    combatant: this.battle.combatants[playerActiveSnooId]
                });
            }
        }

        const winner = this.getWinningTeam();
        if(winner){

            if (winner === 'player'){
                // End the Battle;
                await this.onNewEvent(
                    {type: "textMessage", text: `Winner.`}
                );
            }

            this.onWinner(winner);

            // Stop All Turns.
            return;
        }

        this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
        this.turn();
    }

    getWinningTeam(){
        let aliveTeams = {};
        Object.values(this.battle.combatants).forEach( combat => {
            if(combat.hp > 0){
                aliveTeams[combat.team] = true;
            }
        });

        if(!aliveTeams["player"]) { return "enemy"}
        if(!aliveTeams["enemy"]) { return "player"}

        return;
    }


    async init(){
        console.groupCollapsed(`Battle Start!`);

        Logging.logObject({
            name: 'this.battle.enemy',
            object: this.battle.enemy,
        });

        await this.onNewEvent({
            type: "textMessage",
            text: `${this.battle.enemyName} wants to challage you to a fight.`
        });
        this.turn();
    }

}