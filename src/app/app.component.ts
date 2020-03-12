import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  HostListener
} from "@angular/core";

import { Player } from "../models/player";
import { Map } from "../models/map";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  @ViewChild("game", { static: true })
  private c: ElementRef;
  private ctx: CanvasRenderingContext2D;
  mapa: Map;
  img: HTMLImageElement;

  //event: KeyboardEvent;

  p1: Player;

  public ngOnInit() {
    
    this.ctx = this.c.nativeElement.getContext("2d");
    this.mapa = new Map();
    this.img = new Image();
    // this.img.src =
    //   "https://imgur.com/QpWSwC8";
    this.mapa.draw(this.ctx);
    this.c.nativeElement.width = this.mapa.map[0].length * this.mapa.floor.width;
    this.c.nativeElement.height = this.mapa.map.length * this.mapa.floor.width;
  }

  @HostListener("window:keydown", ["$event"])
  public ngAfterViewInit(event: KeyboardEvent) {
    
    this.c.nativeElement.width = this.mapa.map[0].length * this.mapa.floor.width;
    this.c.nativeElement.height = this.mapa.map.length * this.mapa.floor.width;

    this.mapa.draw(this.ctx);
    this.mapa.movePlayer(event.keyCode);
    this.mapa.draw(this.ctx);
    //this.ctx.drawImage(this.img, 32, 32);
    console.log(event.keyCode);
    

    if (event.keyCode === 8) {
      this.mapa.undo();
      console.log("undo");
      this.mapa.draw(this.ctx);
    }

    this.mapa.testWin();
  }
  reset() {
    this.mapa.map = new Map().lvs[this.mapa.lv - 1];
    this.mapa.player.x = this.mapa.player.y = 1;
    this.mapa.draw(this.ctx);
  }
}
