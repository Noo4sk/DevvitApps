class RevealingText {
    constructor(config){
        this.element = config.element;
        this.text = config.text;
        this.textSpeed = config.textSpeed || 75;

        this.timeout = null;
        this.isDone = false;
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

        this.element.querySelectorAll("span").forEach(sp => {
            sp.classList.add("revealed");
        });
    }

    init(){
        let characters = [];
        this.text.split("").forEach(character => {
            let span = document.createElement("span");
            span.textContent = character;
        
            this.element.appendChild(span);

            characters.push({
                span,
                delayAfter: character === " " ? 0 : this.textSpeed, 
            })
        });

        this.revealOnceCharacter(characters);
    }
}