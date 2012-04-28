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
    TileRenderer.setDimensions(720,480);
    TileRenderer.setPlayer(MazeGen.getGoalCoords());

    TileRenderer.setTiles(MapDecorator.decorate(MazeGen.map));
    TileRenderer.render();

    var ppos = {x:MazeGen.getGoalCoords().x, y:MazeGen.getGoalCoords().y};

    $('.controls button').click(function(e){
      var $target = $(e.target),
          x = $target.data('x'),
          y = $target.data('y'),
          newpos = {x:0,y:0};
          
      e.preventDefault();
      e.stopPropagation();
      
      if(!x&&!y){
        return;
      }

      newpos.x = ppos.x + (x || 0);
      newpos.y = ppos.y + (y || 0);

      if(map[newpos.y][newpos.x]!=='w'){
        return;
      }

      TileRenderer.setPlayer(newpos);
      TileRenderer.render();
      ppos = newpos;
    
    });

/*
    var moving = false,
        frontloading = true,
        numrooms = map[0].length * map.length,
        loadcount = 0,
        $loading = $('.loadbar'),
        $status = $('.status');

    AStarFloodFill.start({
        map: map,
        peak: startPos,
        interval: 15,
        maxRange: 10,
        doneOne: function(){
          if(!frontloading){return;}
          $status.text('Filling tiles...');
          loadcount++;
          var percloaded = ((loadcount/this.mapdims.numcells)* 5500) | 0;
          $loading.width(percloaded);
        },
        doneAll: function(){
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
          }
        }
    });/**/

});
