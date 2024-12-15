class GameObject {
    constructor(config){
        this.id = null;

        this.isMounted = false;

        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || 'down';

        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "./assets/Characters/Cat/s5-2-cat-Sheet-walk.png",
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;

        this.talking = config.talking || [];

        this.retryTimeOut = null;
    }

    mount(map){
        this.isMounted = true;

        // if We have Behavior, Start After delay.
        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10);
    }

    update(){}

    async doBehaviorEvent(map){
        if(this.behaviorLoop.length === 0){
            return;
        }

        if(map.isCutscenePlaying){
            
            if(this.retryTimeOut){
                clearTimeout(this.retryTimeOut);
            }

            this.retryTimeOut = setTimeout( () => {
                this.doBehaviorEvent(map);
            }, 500);
            return;
        }

        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;
        
        // Create instant of event.
        const eventHandler = new OverWorldEvent({
            map,
            event: eventConfig
        });
        await eventHandler.init(); // <- this needs to wait

        // setting the next event.
        this.behaviorLoopIndex += 1;
        if(this.behaviorLoopIndex === this.behaviorLoop.length){
            this.behaviorLoopIndex = 0;
        }

        // repeat.
        this.doBehaviorEvent(map);
    }
}