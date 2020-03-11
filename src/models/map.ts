import {
    ViewChild,
    ElementRef,
    HostListener
  } from "@angular/core";
import{ Player } from "./player";
import { isNullOrUndefined } from 'util';
  
 
  export class Map {
  
    constructor(){
  
  
      this.lvs = [
        [
        [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,2,0,0,2,0,1],
    [1,0,3,0,0,3,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1]
      ],[
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,2,0,0,2,0,1],
    [1,0,3,0,0,3,0,1],
    [1,0,1,2,2,1,0,1],
    [1,0,3,0,0,3,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1]
        ],
        [
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,2,0,0,2,2,3,0,3,3,1],
        [1,0,2,0,2,2,0,1,3,1,3,3,1],
        [1,0,2,0,2,0,0,1,3,1,3,3,1],
        [1,0,0,2,0,0,0,2,3,0,3,3,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,2,2,2,0,0,0,0,0,0,0,1],
        [1,0,0,2,0,2,2,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,3,0,0,1],
        [1,0,0,0,0,0,0,0,3,3,3,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1]
            ]
      ];
      this.lv = 1;

      this.map = this.lvs[0];

      this.player = new Player(1, 1, new Image());
      this.boxA = new Image();
      this.boxB = new Image();
      this.floor = new Image();
      this.target = new Image();
      this.wall = new Image();
      this.playerSet = false;
      this.win = false;
      this.moves = 0;
  
      this.boxA.src = "https://i.imgur.com/QpWSwC8.png";
      this.boxB.src = "https://imgur.com/bLEr6wx.png";
      this.floor.src = "https://imgur.com/VIVYzuI.png";
      this.target.src = "https://imgur.com/dPYxBcN.png";
      this.wall.src = "https://imgur.com/fVdISry.png";
      this.player.img.src = "https://imgur.com/uBXTuT3.png";
    }
    
    playerSet: boolean;
    lv: number;
    lvs: number[][][];
    map : number [][];
    floor: HTMLImageElement;
    boxA: HTMLImageElement;
    boxB: HTMLImageElement;
    target: HTMLImageElement;
    wall: HTMLImageElement;
    player: Player;
    moves: number;
    win: boolean;
    pilha: number[][][];
    pilhaMovX: number[];
    pilhaMovY: number[];

    draw(ctx){
      for(var c = 0; c < this.map.length;c++){
        for(var l = 0; l < this.map[c].length; l++){
  
          if(this.map[c][l]==0){
            ctx.drawImage(this.floor, l*this.wall.width, c*this.wall.width);
          }
  
          if(this.map[c][l] == 1){
            ctx.drawImage(this.wall, l*this.wall.width, c*this.wall.width);
          }
  
          if(this.map[c][l] == 2){
            ctx.drawImage(this.boxA, l*this.wall.width, c*this.wall.width);
          }
  
          if(this.map[c][l] == 3){
            ctx.drawImage(this.target, l*this.wall.width, c*this.wall.width);
          }
          if(this.map[c][l] == 4){
            ctx.drawImage(this.boxB, l*this.wall.width, c*this.wall.width);
          }
        }
      }
      ctx.drawImage(this.player.img, this.player.x * this.floor.height, this.player.y * this.floor.height);
    }  
    //*** MOVE PLAYER ***
    movePlayer(event: number)
    {
      switch(event)
      {
        
        case 65:
        case 37:
          // se na esq tem target
          if(this.player.x > 0 && this.map[this.player.y][this.player.x-1]==3 
            // ou se na esq tem floor
            ||this.map[this.player.y][this.player.x-1]==0||
            // ou se vai pra esq e tem uma caixa
            (this.player.x > 1 && this.map[this.player.y][this.player.x-1]==2 
              // e se na frente da caixa for chão
              && (this.map[this.player.y][this.player.x-2]==0 
                  // ou se na frente da caixa for target
                  ||this.map[this.player.y][this.player.x-2]==3 ))
            ||
            // ou se vai pra esq e tem uma caixa
            (this.player.x > 1 && this.map[this.player.y][this.player.x-1]==4 
              // e se na frente da caixa for chão
              && (this.map[this.player.y][this.player.x-2]==0 
                  // ou se na frente da caixa for target
                  ||this.map[this.player.y][this.player.x-2]==3 ))){


            // se caixa na esq e depois chão empurra caixa para esquerda

            // se for caixa e depois chão, empurra a caixa
            if(this.map[this.player.y][this.player.x-1]==2){
              if(this.map[this.player.y][this.player.x-2]==0){
                this.map[this.player.y][this.player.x-1]=0; 
                this.map[this.player.y][this.player.x-2]=2
              }
              // se depois da caixa for target, caixa muda de cor
              else if(this.map[this.player.y][this.player.x-2]==3){
                this.map[this.player.y][this.player.x-1]=0; 
                this.map[this.player.y][this.player.x-2]=4
              }
            }

            // se a caixa estiver no target e for empurrada
            else if(this.map[this.player.y][this.player.x-1]==4){
              // se for chão depois, volta a ser caixa clara       
              if(this.map[this.player.y][this.player.x-2]==0){
                this.map[this.player.y][this.player.x-1]=3; 
                this.map[this.player.y][this.player.x-2]=2;
              }
              // se for target depois, caixa permanece escura
              else if(this.map[this.player.y][this.player.x-2]==3){
                this.map[this.player.y][this.player.x-1]=3; 
                this.map[this.player.y][this.player.x-2]=4;
              }
            }
            this.player.x--;
            this.moves++;
          }
          break;

          // indo para cima 
        case 87:
        case 38:
          // se em cima tem target
          if(this.player.y > 0 && this.map[this.player.y-1][this.player.x]==3 
            // ou se em cima tem floor
            ||this.map[this.player.y-1][this.player.x]==0||
            // ou se vai pra cima e tem uma caixa
            (this.player.y > 1 && this.map[this.player.y-1][this.player.x]==2 
              // e se na frente da caixa for chão
              && (this.map[this.player.y-2][this.player.x]==0 
                  // ou se na frente da caixa for target
                  ||this.map[this.player.y-2][this.player.x]==3 ))
            ||
            // ou se vai pra cima e tem uma caixa
            (this.player.y > 1 && this.map[this.player.y-1][this.player.x]==4 
              // e se na frente da caixa for chão
              && (this.map[this.player.y-2][this.player.x]==0 
                  // ou se na frente da caixa for target
                  ||this.map[this.player.y-2][this.player.x]==3 ))){

            // se caixa em cima e depois chão empurra caixa para cima
            // se for caixa e depois chão, empurra a caixa
            if(this.map[this.player.y-1][this.player.x]==2){
              if(this.map[this.player.y-2][this.player.x]==0){
                this.map[this.player.y-1][this.player.x]=0; 
                this.map[this.player.y-2][this.player.x]=2
              }
              // se depois da caixa for target, caixa muda de cor
              else if(this.map[this.player.y-2][this.player.x]==3){
                this.map[this.player.y-1][this.player.x]=0; 
                this.map[this.player.y-2][this.player.x]=4
              }
            }

            // se a caixa estiver no target e for empurrada
            else if(this.map[this.player.y-1][this.player.x]==4){
              // se for chão depois, volta a ser caixa clara       
              if(this.map[this.player.y-2][this.player.x]==0){
                this.map[this.player.y-1][this.player.x]=3; 
                this.map[this.player.y-2][this.player.x]=2;
              }
              // se for target depois, caixa permanece escura
              else if(this.map[this.player.y-2][this.player.x]==3){
                this.map[this.player.y-1][this.player.x]=3; 
                this.map[this.player.y-2][this.player.x]=4;
              }
            }
            this.player.y--; this.moves++;
          }
          break;

          // indo para a direita

        case 39:
        case 68:

          // se na direita tem target
          if(this.player.x < this.map.length && this.map[this.player.y][this.player.x+1]==3 
            // ou se na direita tem floor
            ||this.map[this.player.y][this.player.x+1]==0||
            // ou se vai pra direita e tem uma caixa
            (this.player.x < this.map.length && this.map[this.player.y][this.player.x+1]==2 
              // e se na frente da caixa for chão
              && (this.map[this.player.y][this.player.x+2]==0 
                  // ou se na frente da caixa for target
                  ||this.map[this.player.y][this.player.x+2]==3 ))
            ||
            // ou se vai pra direita e tem uma caixa
            (this.player.x < this.map.length && this.map[this.player.y][this.player.x+1]==4 
              // e se na frente da caixa for chão
              && (this.map[this.player.y][this.player.x+2]==0 
                  // ou se na frente da caixa for target
                  ||this.map[this.player.y][this.player.x+2]==3 ))){


            // se caixa na direita e depois chão empurra caixa para direita

            // se for caixa e depois chão, empurra a caixa
            if(this.map[this.player.y][this.player.x+1]==2){
              if(this.map[this.player.y][this.player.x+2]==0){
                this.map[this.player.y][this.player.x+1]=0; 
                this.map[this.player.y][this.player.x+2]=2
              }
              // se depois da caixa for target, caixa muda de cor
              else if(this.map[this.player.y][this.player.x+2]==3){
                this.map[this.player.y][this.player.x+1]=0; 
                this.map[this.player.y][this.player.x+2]=4
              }
            }

            // se a caixa estiver no target e for empurrada
            else if(this.map[this.player.y][this.player.x+1]==4){
              // se for chão depois, volta a ser caixa clara       
              if(this.map[this.player.y][this.player.x+2]==0){
                this.map[this.player.y][this.player.x+1]=3; 
                this.map[this.player.y][this.player.x+2]=2;
              }
              // se for target depois, caixa permanece escura
              else if(this.map[this.player.y][this.player.x+2]==3){
                this.map[this.player.y][this.player.x+1]=3; 
                this.map[this.player.y][this.player.x+2]=4;
              }
            }
            this.player.x++; 
            this.moves++;
          }
          break;     


          // indo para baixo
        case 40:
        case 83:

          // se em baixo tem target
          if(this.player.y < this.map.length && this.map[this.player.y+1][this.player.x]==3 
            // ou se em baixo tem floor
            ||this.map[this.player.y+1][this.player.x]==0||
            // ou se vai pra baixo e tem uma caixa
            (this.player.x < this.map.length && this.map[this.player.y+1][this.player.x]==2 
              // e se na frente da caixa for chão
              && (this.map[this.player.y+2][this.player.x]==0 
                  // ou se na frente da caixa for target
                  ||this.map[this.player.y+2][this.player.x]==3 ))
            ||
            // ou se vai pra baixo e tem uma caixa
            (this.player.x < this.map.length && this.map[this.player.y+1][this.player.x]==4 
              // e se na frente da caixa for chão
              && (this.map[this.player.y+2][this.player.x]==0 
                  // ou se na frente da caixa for target
                  ||this.map[this.player.y+2][this.player.x]==3 ))){


            // se caixa em baixo e depois chão empurra caixa para baixo

            // se for caixa e depois chão, empurra a caixa
            if(this.map[this.player.y+1][this.player.x]==2){
              if(this.map[this.player.y+2][this.player.x]==0){
                this.map[this.player.y+1][this.player.x]=0; 
                this.map[this.player.y+2][this.player.x]=2
              }
              // se depois da caixa for target, caixa muda de cor
              else if(this.map[this.player.y+2][this.player.x]==3){
                this.map[this.player.y+1][this.player.x]=0; 
                this.map[this.player.y+2][this.player.x]=4
              }
            }

            // se a caixa estiver no target e for empurrada
            else if(this.map[this.player.y+1][this.player.x]==4){
              // se for chão depois, volta a ser caixa clara       
              if(this.map[this.player.y+2][this.player.x]==0){
                this.map[this.player.y+1][this.player.x]=3; 
                this.map[this.player.y+2][this.player.x]=2;
              }
              // se for target depois, caixa permanece escura
              else if(this.map[this.player.y+2][this.player.x]==3){
                this.map[this.player.y+1][this.player.x]=3; 
                this.map[this.player.y+2][this.player.x]=4;
              }
            }
            this.player.y++; 
            this.moves++;
          }
          break;
      }
  
      
    }

    testWin(){
      let countTargets = 0;
        
       for(let c = 0; c < this.map.length;c++){
        for(let l = 0; l < this.map[c].length; l++){
          if(this.map[c][l]==3){
            countTargets++;
          }
          
        }
       }
      if(countTargets == 0){
        this.win = true;
      } 
      if(this.win === true){
        this.win = false;  
        if(this.lv < this.lvs.length){
          this.lv++;
          this.map = this.lvs[this.lv-1];    
          this.moves = 0;  
          this.player.x = 1;
          this.player.y = 1;
        } 
        else{
          this.lvs = 
          [
            [
            [1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,1],
            [1,0,2,0,0,2,0,1],
            [1,0,3,2,0,3,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,0,0,2,0,0,1],
            [1,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1]
            ],[
            [1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,1],
            [1,0,2,0,2,2,0,1],
            [1,0,3,2,0,3,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,2,0,2,0,2,1],
            [1,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1]
            ],
            [
            [1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,2,0,0,2,2,3,0,3,3,1],
            [1,0,2,0,2,2,0,1,3,1,3,3,1],
            [1,0,2,0,2,0,0,1,3,1,3,3,1],
            [1,0,0,2,0,0,0,2,3,0,3,3,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,2,2,2,0,0,0,0,0,0,0,1],
            [1,0,0,2,0,2,2,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,3,0,0,1],
            [1,0,0,0,0,0,0,0,3,3,3,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1]
            ]
          ];
          this.lv=1;
          this.map = this.lvs[0];
          this.moves = 0;  
        } 
      }
    }
    undo(){
      this.pilha.pop();
      this.pilhaMovY.pop();
      this.pilhaMovX.pop();

      this.player.x = this.pilhaMovX[this.pilhaMovX.length - 1];
      this.player.y = this.pilhaMovY[this.pilhaMovY.length - 1];
      this.map = this.pilha[this.pilha.length-1];
    }
  }