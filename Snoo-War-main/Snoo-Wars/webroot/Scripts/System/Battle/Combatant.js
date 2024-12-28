class Combatant {
    constructor(config, battle){ 
        Object.keys(config).forEach(key => {
            //console.log(`Keys ${key}`);
            this[key] = config[key];
        });

        this.hp = typeof(this.hp) === "undefined" ? this.maxHp : this.hp;
        this.battle = battle;
    }


    EnemyCombatant(){
        return this.battle?.activeCombatants['enemy'];
    }

    get givesXp(){
        let enemy = this.EnemyCombatant();
        let snoolevel = Snoo[enemy].level;
        console.log(`================${snoolevel}`);
        let xpToGive = Math.round((Math.pow( (snoolevel / 0.249), 2)));

        console.log(`================${xpToGive}`);

        return xpToGive;
    }

    get givesMoney(){
        let enemy = this.EnemyCombatant();
        let snoolevel = Snoo[enemy].level;
        let MoneyToGive = Math.round((Math.pow( (snoolevel / 0.4), 2)));

        return MoneyToGive;
    }

    get hpPercent(){
        const percent = this.hp / this.maxHp * 100;
        return percent > 0 ? percent : 0;
    }

    get xpPercent(){
        return this.xp / this.max_Xp * 100;
    }

    get isActive(){
        return this.battle?.activeCombatants[this.team] === this.id;
    }

    getPostEvents(){
        return [];
    }

    createElement() {
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("Combatant");
        this.hudElement.setAttribute("data-combatant", this.id);
        this.hudElement.setAttribute("data-team", this.team);
        this.hudElement.innerHTML = (`
            <p class="Combatant_name">${this.name}</p>
            <p class="Combatant_level_number"></p>

            <img id='basePlate' src="../../assets/UI/basePlate.png" alt="BasePlate">
            <svg viewBox="0 0 26 3" class="Combatant_life-container">
                <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
                <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
            </svg>

            <svg viewBox="0 0 30 2" class="Combatant_xp-container">
                <rect x=0 y=0 width="100%" height=1 fill="#9fc5e8" />
                <rect x=0 y=1 width="100%" height=1 fill="#7f9db9" />
            </svg>

        `)
        this.floatNumber = document.createElement("p");
        this.floatNumber.classList.add("floatNumber");
        this.floatNumber.setAttribute("alt", '999999');
        this.floatNumber.setAttribute("data-team", this.team);
        this.floatNumber.innerText = '99999999';


        this.SnooElement = document.createElement("img");
        this.SnooElement.classList.add("Snoo");
        this.SnooElement.setAttribute("src", this.snooImage);
        this.SnooElement.setAttribute("alt", this.name);
        this.SnooElement.setAttribute("data-team", this.team);

        
        this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect");
        this.xpFills = this.hudElement.querySelectorAll(".Combatant_xp-container > rect");

    }

    update(changes={}){
        Object.keys(changes).forEach( key => {
            this[key] = changes[key];
        });

        
        this.hudElement.setAttribute("data-active", this.isActive);
        this.SnooElement.setAttribute("data-active", this.isActive);
        this.floatNumber.setAttribute("data-active", this.isActive);

        this.hpFills.forEach( rect => rect.style.width = `${this.hpPercent}%`);
        this.xpFills.forEach( rect => rect.style.width = `${this.xpPercent}%`);

        this.hudElement.querySelector(".Combatant_level_number").innerText = `lvl: ${this.level}`;
    }

    init(container){
        this.createElement();

        this.basePlateImage = document.getElementById("basePlate");

        const resizedImage = utils.resizeImage(this.basePlateImage, 200, 150); // Resize to 200x150 pixels
        this.basePlateImage.src = resizedImage;


        container.appendChild(this.hudElement);
        container.appendChild(this.SnooElement);
        container.appendChild(this.floatNumber);

        this.update();
    }
}