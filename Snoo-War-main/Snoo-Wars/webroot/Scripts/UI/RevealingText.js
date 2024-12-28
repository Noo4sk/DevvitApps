class RevealingText {
    constructor(config){
        this.actor = config.actor || '';
        this.element = config.element;
        this.text = config.text;
        this.textSpeed = config.textSpeed || 75;

        this.timeout = null;
        this.isDone = false;

        this.placeCharacters = null;

        this.spanSound = new Audio();
        this.spanSound.src = './assets/Audio/medium-text-blip_1s.mp3';
        this.spanSound.volume = 0.2;

    }


    revealOnceCharacter(list){


        const next = list.splice(0,1)[0];
        next.span.classList.add("revealed");
        if (list.length > 0){

            this.timeout = setTimeout(() => {
                this.revealOnceCharacter(list);

            }, next.delayAfter);
    
        } else {
            this.isDone = true;
        }
    }

    warpToDone(){
        clearTimeout(this.timeout);
        this.isDone = true;

        this.placeCharacters.querySelectorAll("span").forEach(sp => {
            sp.classList.add("revealed");
        });
    }

    init(){
        let characters = [];

        let placeActor = document.createElement("p");
        placeActor.innerText = `${this.actor}`; //`[${this.actor}]`;
        if(this.actor){
            this.element.appendChild(placeActor);
        }
        this.placeCharacters = document.createElement('div');
        this.placeCharacters.classList.add('Character-container');
        this.element.appendChild(this.placeCharacters);

        this.text.split("").forEach(character => {
            let span = document.createElement("span");
            span.setAttribute('id', 'textCharacter'); // add padding for characters TODO LIST.
            span.textContent = character;

            this.placeCharacters.appendChild(span);

            characters.push({
                span,
                delayAfter: character === " " ? 0 : this.textSpeed, 
            })
        });

        this.revealOnceCharacter(characters);
    }
}