window.BattleAnimations = {
    async floatNumber(event, onComplete){
        const element = event.caster.floatNumber;
        
        const animationClassName = event.caster.team === "player" ? "battle-float-left" :  "battle-float-right";
        element.classList.add(animationClassName);
        
        
        element.addEventListener("animationend", () => {
            element.classList.remove(animationClassName);
        }, { once:true });

        await utils.wait(100);

        onComplete();
    },

    async leap(event, onComplete){
        const element = event.caster.SnooElement;
        
        const animationClassName = event.caster.team === "player" ? "battle-attack-right": "battle-attack-left";
        element.classList.add(animationClassName);

        element.addEventListener("animationend", () => {
            element.classList.remove(animationClassName);
        }, { once:true});

        await utils.wait(100);
        onComplete();
    },

}