class Person extends GameObject {
    constructor(config){
        super(config);

        this.moveingProgressRemaining = 0;
        this.isStanding = false;
        this.intentPosition = null;

        this.isPlayerControlled = config.isPlayerControlled || false;
        this.directionUpdate = {
            "up": ['y', -1],
            "down": ['y', 1],
            "left": ['x', -1],
            "right": ['x', 1],
        }
    }

    update(state){
        if(this.moveingProgressRemaining > 0){
            this.updatePosition();

        } else {

            if(!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow){
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                });
            }

            this.updateSprite(state);
        }
    }

    /**
    * @param {any} state - state of the object.
    * @param {object} behavior - an object with type and direction for a behavior.
    */
    startBehavior(state, behavior){
        if(!this.isMounted){
            return;
        }

        this.retry = false;
        this.direction = behavior.direction;

        switch(behavior.type){
            case 'walk':
                if(state.map.isSpaceTaken(this.x, this.y, this.direction)){
                    behavior.retry && setTimeout(() => {
                       this.startBehavior(state, behavior);
                    }, 10);
                    return;
                }
    
                this.moveingProgressRemaining = 16;

                // intent
                const intentPosition = utils.nextPosition(this.x, this.y, this.direction);
                this.intentPosition = [
                    intentPosition.x,
                    intentPosition.y,
                ];

                this.updateSprite(state);
                break;
            
            case 'stand':
                this.isStanding = true;
                setTimeout(() => {
                    EventUtils.emitEvent("PersonStandComplete", {
                        whoId: this.id,
                    });
                }, behavior.time);
                this.isStanding = false;

                break;
        }
    }

    /**
    * @param function - update the position of the Person
    */
    updatePosition(){
        const [property, value] = this.directionUpdate[this.direction];

        this[property] += value;
        this.moveingProgressRemaining -= 1;

        if (this.moveingProgressRemaining === 0){
            EventUtils.emitEvent("PersonWalkingComplete", {
                whoId: this.id,
            });
            this.intentPosition = null;
        }
    }

    /**
    * @param {object} state - state object with sprite Info. [ Function Updates Person Sprite ]
    */
    updateSprite(){
        if(this.moveingProgressRemaining > 0){
            this.sprite.setAnimation("walk-"+this.direction);
            return;
        }
        this.sprite.setAnimation("idle-"+this.direction);

    }
}