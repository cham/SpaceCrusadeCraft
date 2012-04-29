/**
* TileRenderer
* it renders tiles! (to canvas)
*
* @license Creative Commons Attribution-ShareAlike 3.0 Unported License
* @datepublished December 2010
*/
define(function(){
  'use strict';

  var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');

  return {

    $el: null,
    canvas: canvas,
    context: context,
    viewport: {
      tileswide: 0,
      tileshigh: 0
    },
    playerposition: {
      coords: {x:0,y:0},
      offset: {x:0,y:0}
    },
    options: {
      tilewidth: 48,
      tileheight: 48
    },
    tiles: [],
    renderqueue: [],

    /*
     * initialisation methods
     */
    setEl: function($container){
      this.$el = $container;
      this.$el.html(canvas);
    },

    setOptions: function(opt){
      this.options = _(this.options).extend(opt);
    },

    setDimensions: function(w,h){
      var $c = $(this.canvas),
          cw = w + (this.options.tilewidth*2),
          ch = h + (this.options.tileheight*2);

      this.width = w;
      this.height = h;

      this.$el.width(w);
      this.$el.height(h);

      $c.width(cw);
      $c.height(ch);
      $c.css({
        top: (-this.options.tileheight)+'px',
        left: (-this.options.tilewidth)+'px'
      })
      this.canvas.width = cw;
      this.canvas.height = ch;

      this.viewport.tileswide = Math.ceil(this.width / this.options.tilewidth);
      this.viewport.tileshigh = Math.ceil(this.height / this.options.tileheight);
    },

    setTiles: function(t){
      this.tiles = t;
    },

    setPlayerPosition: function(posinfo){
      _(this.playerposition).extend(posinfo); // {coords:{x:0,y:0}, offset:{x:0,y:0}}
    },

    setCanvasOffset: function(){
      $(this.canvas).css({
        top: -this.playerposition.offset.y - this.options.tileheight,
        left: -this.playerposition.offset.x - this.options.tilewidth
      });/**/
    },

    getCenter: function(){
      return {
        x: (this.viewport.tileswide/2) | 0,
        y: (this.viewport.tileshigh/2) | 0
      };
    },

    /*
     * drawing
     */
    // draws the map tile specified by coords on the screen, accounting for viewport position
    drawTile: function(coords){
      var transformCenter = this.getCenter(),
          pixelcursor = {
            x: (coords.x - this.playerposition.coords.x + transformCenter.x) * this.options.tilewidth,
            y: (coords.y - this.playerposition.coords.y + transformCenter.y) * this.options.tileheight
          },
          tiletype = '';

      if(coords.y>0 && coords.x>0 && coords.y<this.tiles.length && coords.x<this.tiles[0].length){
        tiletype = this.tiles[coords.y][coords.x];
      }

      switch(tiletype){
        case 'f0':
          this.context.fillStyle = "#33FF33";
          break;
        case 'f1':
          this.context.fillStyle = "#CCFFCC";
          break;
        case 'f':
          this.context.fillStyle = "#99FF99";
          break;
        case 'w0':
          this.context.fillStyle = "#000000";
          break;
        case 'W':
          this.context.fillStyle = "#333333";
          break;
        default:
          this.context.fillStyle = "#000000";
      }

      this.context.fillRect(
        pixelcursor.x,
        pixelcursor.y,
        this.options.tilewidth,
        this.options.tileheight
      );

//      ctx.drawImage(spriteInfo.canvas, spriteInfo.x, spriteInfo.y , spriteInfo.tiledims.x, spriteInfo.tiledims.y, ox  + offset.x , oy  + offset.y , dx - ox , dy - oy );
    },

    drawPlayer: function(){
      var center = this.getCenter(),
          pixelcursor = {
            x: center.x * this.options.tilewidth + this.playerposition.offset.x,
            y: center.y * this.options.tileheight + this.playerposition.offset.y
          };

      this.context.fillStyle = '#9999FF';
      this.context.fillRect(
        pixelcursor.x+10, // TODO
        pixelcursor.y+10,
        this.options.tilewidth-20,
        this.options.tileheight-20
      );
    },

    updateAllTiles: function(){
      var self = this,
          transformCenter = this.getCenter();
      self.renderqueue = [];
      _(self.viewport.tileshigh+3).times(function(y){
        _(self.viewport.tileswide+3).times(function(x){
          var tilex = x + self.playerposition.coords.x - transformCenter.x - 1,
              tiley = y + self.playerposition.coords.y - transformCenter.y - 1;
          self.renderqueue.push({x: tilex, y: tiley});
        });
      });
    },

    render: function(){
      var self = this;

      _(this.renderqueue).chain().uniq().each(function(tilecoords){
        self.drawTile(tilecoords);
      });

      this.drawPlayer();

      this.setCanvasOffset();
    }
  };

});