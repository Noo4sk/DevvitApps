class Combatant {
    constructor(config, battle){
        Object.keys(config).forEach(key => {
            this[key] = config[key];
        });
        this.hp = typeof(this.hp) === "undefined" ? this.maxHp : this.hp;
        this.battle = battle;
    }

    get givesXp(){
        return 101;
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
            <p class="Combatant_level"></p>
            <div class="Combatant_character_crop">
                <img class="Combatant_character" alt="${this.name}" src="${this.snooImage}" />
            </div>

            <p class="Combatant_life"></p>
            <p class="Combatant_level_number"></p>

            <svg viewBox="0 0 26 3" class="Combatant_life-container">
                <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
                <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
            </svg>

            <svg viewBox="0 0 26 2" class="Combatant_xp-container">
                <rect x=0 y=0 width="0%" height=1 fill="#9fc5e8" />
                <rect x=0 y=1 width="0%" height=1 fill="#7f9db9" />
            </svg>

            <svg viewBox="0 0 26 2" class="Combatant_level-container">
                <rect x=0 y=0 width="100px" height="100px" fill="#2f2f2f" />
            </svg>
        `)

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

        this.hpFills.forEach( rect => rect.style.width = `${this.hpPercent}%`);
        this.xpFills.forEach( rect => rect.style.width = `${this.xpPercent}%`);

        this.hudElement.querySelector(".Combatant_level_number").innerText = `lvl: ${this.level}`;
    }

    init(container){
        this.createElement();
        container.appendChild(this.hudElement);
        container.appendChild(this.SnooElement);

        this.update();
    }
}