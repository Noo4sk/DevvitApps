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
      },

      resizeImage(img, newWidth, newHeight) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
      
        canvas.width = newWidth;
        canvas.height = newHeight;
      
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
        return canvas.toDataURL(); // Returns the resized image as a base64 encoded string
      }
}