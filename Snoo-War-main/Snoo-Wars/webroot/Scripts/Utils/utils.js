/**
 * 
 */
const utils = {

    /**
    * @param {number} n - standard number.
    * @param return - value * 16
    */
    withGrid(n) {
        return n * 16;
    },

    /**
    * @param {number} intX - Takes X position of the object.
    * @param {number} intY - Takes Y position of the object.
    * @param {string} return - value pair `x,y`
    */
    asGridCoord(x, y){
        return `${x*16},${y*16}`;
    },
    getGridCoord(str){
      let grid = str.split(",");
      let x = Number(grid[0]);
      let y = Number(grid[1]);

      return {x, y};
  },


    // /**
    // * @param {number} intX - Current X position of the object.
    // * @param {number} intY - Current Y position of the object.
    // * @param {string} direction - The current direction of the Object
    // * @param {object} return - { x, y }
    // */
    // nextPosition(intX, intY, direction){
    //     let x = intX;
    //     let y = intY;
    //     const size = 16;

    //     switch(direction){
    //         case "up":
    //             y -= size;
    //             break;

    //         case "down":
    //             y += size;
    //             break;

    //         case "left":
    //             x -= size;
    //             break;

    //         case "right":
    //             x += size;
    //             break;
    //     }

    //     return {x, y};

    // },

    // oppositeDirection(direction){
    //     switch (direction) {
    //         case 'left':
    //             return "right";        
    //         case 'right':
    //             return "left";
    //         case 'up':
    //             return "down";  
    //         default:
    //             return 'up';
    //     }
        
    // },

    nextPosition(initialX, initialY, direction) {
        let x = initialX;
        let y = initialY;
        const size = 16;
        if (direction === "left") { 
          x -= size;
        } else if (direction === "right") {
          x += size;
        } else if (direction === "up") {
          y -= size;
        } else if (direction === "down") {
          y += size;
        }
        return {x,y};
      },
      oppositeDirection(direction) {
        if (direction === "left") { return "right" }
        if (direction === "right") { return "left" }
        if (direction === "up") { return "down" }
        return "up"
      },
      
      wait(ms){
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
}