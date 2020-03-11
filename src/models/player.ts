export class Player {
    constructor(x: number, y: number, img: HTMLImageElement){
      this.x = x;
      this.y = y;
      this.img = img;
    }
    x : number;
    y : number;
    img : HTMLImageElement;
    setX(x: number){
      this.x = x;
    }
    setY(y: number){
      this.y = y;
    }
    getX(){
      return this.x;
    }
    getY(){
      return this.y;
    }
  }