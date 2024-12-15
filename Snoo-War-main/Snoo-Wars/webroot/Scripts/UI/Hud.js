class Hud {
    constructor(){
        this.scoreBoards = [];
    }

    createElement(){
        this.element = document.createElement("div");
        this.element.classList.add("Hud");
        const { playerState } = window;

        playerState.lineup.forEach(key => {
            const snoo = playerState.snoo[key];

            const scoreBoard = new Combatant({
                id: key,
                ...Snoo[snoo.id],
                ...snoo,
            }, null);

            scoreBoard.createElement();
            this.scoreBoards.push(scoreBoard);

            this.element.appendChild(scoreBoard.hudElement);
        });
        this.update();
    }

    update(){
        this.scoreBoards.forEach( item => {
            item.update(window.playerState.snoo[item.id]);
        });
    }

    init(container){
        this.createElement();
        container.appendChild(this.element);

        document,addEventListener("PlayerStateUpdated", () => {
            this.update();
        });
    }
}