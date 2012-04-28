require(['MazeGen', 'MapDecorator', 'TileRenderer', 'AStarFloodFill'],

function(MazeGen, MapDecorator, TileRenderer, AStarFloodFill) {
    var mapw = 100,
        maph = 80;

    MazeGen.setSize(mapw,maph);
    MazeGen.setRooms([
    [
      [' ',' ',' ',' ','W','+','W','+','W',' '],
      ['W','W','W','W','W','f','f','f','W','W'],
      ['+','f','f','f','f','f','f','f','f','W'],
      ['W','f','f','f','f','f','f','f','f','W'],
      ['W','f','f','f','f','f','f','f','f','W'],
      ['W','f','f','f','f','f','f','f','f','W'],
      ['W','f','f','f','f','f','f','f','f','+'],
      ['W','f','f','f','f','f','f','f','f','W'],
      ['W','f','f','f','f','f','f','f','f','W'],
      ['W','f','f','f','f','f','f','f','f','W'],
      ['W','f','f','f','f','f','f','f','f','+'],
      ['+','f','W','f','f','f','f','f','f','W'],
      ['W','W','W','f','f','f','f','f','W','W'],
      [' ',' ','W','+','W','W','W','+','W',' ']
    ],
    [
      [' ',' ',' ',' ',' ',' ',' ',' ','W','+','W','W','W',' '],
      [' ',' ',' ','W','+','W','W','W','W','f','f','f','W',' '],
      [' ',' ',' ','W','f','f','f','f','f','f','f','f','W','W'],
      [' ',' ',' ','+','f','f','f','f','f','f','f','f','f','+'],
      [' ',' ',' ','W','f','f','f','f','f','f','f','f','W','W'],
      [' ',' ',' ','W','f','f','f','f','f','f','f','f','W',' '],
      [' ',' ',' ','W','W','f','f','f','f','f','f','f','W','W'],
      [' ',' ',' ',' ','W','f','f','f','f','f','f','f','f','W'],
      [' ',' ',' ','W','W','f','f','f','f','f','f','f','f','+'],
      [' ',' ',' ','W','f','f','f','f','f','f','f','f','f','W'],
      ['W','W','+','W','f','f','f','f','f','f','f','f','W','W'],
      ['+','f','f','f','f','f','f','f','f','f','f','f','W',' '],
      ['W','W','W','f','f','f','f','f','f','f','f','f','W','W'],
      [' ',' ','W','W','f','f','f','f','f','f','f','f','f','W'],
      [' ',' ',' ','+','f','f','f','f','f','f','f','f','f','+'],
      [' ',' ',' ','W','W','+','W','W','W','f','f','f','W','W'],
      [' ',' ',' ',' ',' ',' ',' ',' ','W','W','+','W','W',' ']
    ],
    [
      [' ','W','+','W','W','W','+','W',' '],
      [' ','W','f','f','f','f','f','W',' '],
      ['W','W','f','f','f','f','f','W','W'],
      ['W','f','f','f','f','f','f','f','W'],
      ['W','f','f','f','f','f','f','f','W'],
      ['+','f','f','f','f','f','f','f','+'],
      ['W','f','f','f','f','f','f','f','W'],
      ['W','f','f','f','f','f','f','f','W'],
      ['W','f','f','f','f','f','f','f','W'],
      ['W','f','f','f','f','f','f','f','W'],
      ['W','f','f','f','f','f','f','f','W'],
      ['+','f','f','f','f','f','f','f','W'],
      ['W','W','W','f','f','f','W','W','W'],
      [' ',' ','W','+','W','+','W',' ',' ']
    ],
    [
      ['W','+','W','+','W',' ',' ',' ',' ',' ',' ',' '],
      ['W','f','f','f','W',' ',' ',' ',' ',' ',' ',' '],
      ['+','f','f','f','W',' ',' ',' ',' ',' ',' ',' '],
      ['W','f','f','f','W',' ',' ',' ','W','+','W','W'],
      ['+','f','f','f','W',' ',' ',' ','W','f','f','+'],
      ['W','f','f','f','f','W','W','W','f','f','f','W'],
      [' ','W','f','f','f','f','f','f','f','f','W','W'],
      [' ',' ','W','f','f','f','f','f','W',' ',' ',' '],
      [' ',' ','+','f','f','f','f','f','W',' ',' ',' '],
      [' ',' ','W','f','f','f','f','f','+',' ',' ',' '],
      [' ',' ','W','f','f','f','f','f','W',' ',' ',' '],
      [' ',' ','W','f','f','f','f','f','W',' ',' ',' '],
      [' ',' ','W','f','f','f','f','f','W',' ',' ',' '],
      [' ',' ','W','f','f','f','f','f','W',' ',' ',' '],
      [' ','W','f','f','f','f','f','f','f','W',' ',' '],
      [' ','+','f','f','f','W','W','W','f','f','W',' '],
      [' ','W','+','W',' ',' ',' ','W','f','f','W',' '],
      [' ',' ',' ',' ',' ',' ','W','f','f','f','W',' '],
      [' ',' ',' ',' ',' ','W','f','f','f','f','W','W'],
      [' ',' ',' ',' ',' ','W','f','f','f','f','f','+'],
      [' ',' ',' ',' ',' ','W','+','W','W','W','W','W']
    ]]);

    MazeGen.reverseGoal = Math.random() < 0.5;
    MazeGen.generate();

    var map = MazeGen.getWalkableMap(),
        startPos = MazeGen.getStartCoords();

    TileRenderer.setEl($('#map'));
    TileRenderer.setDimensions(720,400);
    TileRenderer.setPlayerPosition({
      coords:MazeGen.getGoalCoords()
    });

    TileRenderer.setTiles(MapDecorator.decorate(MazeGen.map));
    TileRenderer.updateAllTiles();
    TileRenderer.render();

    var ppos = {x:MazeGen.getGoalCoords().x, y:MazeGen.getGoalCoords().y},
        poff = {x:0,y:0},
        moving = {x:0,y:0};

    $('.controls button').click(function(e){
      var $target = $(e.target),
          x = $target.data('x'),
          y = $target.data('y');

      e.preventDefault();
      e.stopPropagation();

      moving.x = x || 0;
      moving.y = y || 0;
    });


    var frontloading = true,
        numrooms = map[0].length * map.length,
        loadcount = 0,
        $loading = $('.loadbar'),
        $status = $('.status');


    AStarFloodFill.start({
        map: map,
        peak: ppos,
        interval: 40,
        maxRange: 10,
        doneOne: function(){
          //if(!frontloading){return;}
          $status.text('Filling tiles...');
          loadcount++;

          var percloaded = ((loadcount/this.spiralSeq.length) * 720 ) | 0;
          $loading.width(percloaded);
        },
        doneAll: function(){
          loadcount = 0;
          /*
          function move(){
            var moveto = AStarFloodFill.lowestNeighborTo({x:ppos.x,y:ppos.y});

            moving = true;
            ppos.x = moveto.x;
            ppos.y = moveto.y;

            TileRenderer.setPlayer(ppos);
            TileRenderer.render();
            if(startPos.x===ppos.x && startPos.y===ppos.y){
              $status.text('Done');
            }else{
              setTimeout(move,600);
            }
          }
          if(!moving){
            move();
            frontloading = false;
            $loading.width(720);
            $status.text('Moving to goal');
          }/**/
        }
    });/**/





    var movetimer;
    function moveplayer(){
      var newpos = {x:0,y:0},
          offset = {x:0,y:0};

      offset.x = poff.x + ((moving.x) * 4);
      offset.y = poff.y + ((moving.y ) * 4);
      newpos.x = ppos.x;
      newpos.y = ppos.y;

      if(offset.x>24){
        offset.x -= 48;
        newpos.x += 1;
      }else if(offset.x<-24){
        offset.x += 48;
        newpos.x -= 1;
      }
      if(offset.y>24){
        offset.y -= 48;
        newpos.y += 1;
      }else if(offset.y<-24){
        offset.y += 48;
        newpos.y -= 1;
      }

      if(map[newpos.y][newpos.x]!=='w'){
        return;
      }

      TileRenderer.setPlayerPosition({
        coords: newpos,
        offset: offset
      });
      AStarFloodFill.setPeak(newpos);
      TileRenderer.updateAllTiles();
      TileRenderer.render();

      ppos = newpos;
      poff = offset;
      movetimer = setTimeout(function(){moveplayer();},40);
    }
    moveplayer();
});
