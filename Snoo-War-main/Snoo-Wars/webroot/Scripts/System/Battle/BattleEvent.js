class BattleEvent {
    constructor(event, battle){
        this.event = event;
        this.battle = battle;
    }

    submissionMenu(resolve){
        const menu = new SubmissionMenu({
            caster: this.event.caster,
            enemy: this.event.enemy,
            items: this.battle.items,
            onComplete: submission => {
                resolve(submission);
            }
        });
        menu.init( this.battle.element );
    }

    textMessage(resolve){
        const text = this.event.text
        .replace("{CASTER}", this.event.caster?.name)
        .replace("{TARGET}", this.event.target?.name)
        .replace("{ACTION}", this.event.action?.name)


        const message = new TextMessage({
            text,
            onComplete: () => {
                resolve();
            }
        });
        message.init(this.battle.element);
    }

    giveXp(resolve){
        const level_up = new Audio("./assets/Audio/cute-level-up-3-189853.mp3")
        level_up.volume = 0.05;

        let amount = this.event.xp;
        const { combatant } = this.event;
        const step = () => {
            if( amount > 0){
                amount -= 1;
                combatant.xp += 1;

                // check Max
                if(combatant.xp === combatant.max_Xp){
                    level_up.play();
                    
                    combatant.xp = 0;
                    combatant.max_Xp = 100;
                    combatant.level += 1;
                }

                combatant.update();
                requestAnimationFrame(step);
                return;
            }

            resolve();
        }
        requestAnimationFrame(step);
    }

    async stateChange(resolve){
        const {caster, target, damage, recovery, action} = this.event;
        let who = this.event.onCaster ? caster : target;

        if(action.targetType === "friendly"){
            who = caster;
        }

        if(damage){
            // modify damage.
            target.update({
                hp: target.hp - damage,
            })

            // start blinking 
            target.SnooElement.classList.add("battle-damage-blink");

            // await.
            await utils.wait(600);

            // stop blinking / reslove event.
            target.SnooElement.classList.remove("battle-damage-blink");
        }

        if (recovery){
            let newHp = who.hp + recovery;
            if(newHp > who.maxHp){
                newHp = who.maxHp;
            }

            who.update({
                hp: newHp,
            });
        }

        resolve();
    }

    animation(resolve){
        const fn = BattleAnimations[this.event.animation];
        fn(this.event, resolve);
    }

    init(resolve){
        this[this.event.type](resolve);
    }
}