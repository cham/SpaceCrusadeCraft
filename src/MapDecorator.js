/**
* TileDecorator
* decorate maps from MazeGen
*
* @license Creative Commons Attribution-ShareAlike 3.0 Unported License
* @datepublished December 2010
*/
define(function(){
  'use strict';

  return {
    
    map: [],

    tileExists: function(coords){
    	return !!(this.map[coords.y] && this.map[coords.y][coords.x]);
    },

    adjacentTiles: function(coords){
    	return [
    		[
	    		this.tileExists({ x: coords.x-1, y: coords.y-1 }) ? this.map[coords.y-1][coords.x-1] : '',
	    		this.tileExists({ x: coords.x  , y: coords.y-1 }) ? this.map[coords.y-1][coords.x] : '',
	    		this.tileExists({ x: coords.x+1, y: coords.y-1 }) ? this.map[coords.y-1][coords.x+1] : ''
    		],
    		[
	    		this.tileExists({ x: coords.x-1, y: coords.y   }) ? this.map[coords.y   ][coords.x-1] : '',
	    		this.tileExists({ x: coords.x  , y: coords.y   }) ? this.map[coords.y   ][coords.x] : '',
	    		this.tileExists({ x: coords.x+1, y: coords.y   }) ? this.map[coords.y   ][coords.x+1] : ''
    		],
    		[
	    		this.tileExists({ x: coords.x-1, y: coords.y+1 }) ? this.map[coords.y+1][coords.x-1] : '',
	    		this.tileExists({ x: coords.x  , y: coords.y+1 }) ? this.map[coords.y+1][coords.x] : '',
	    		this.tileExists({ x: coords.x+1, y: coords.y+1 }) ? this.map[coords.y+1][coords.x+1] : ''
    		]
    	];
    },

    makeNullFilledArray: function(i){
        var arr = [];
        while(i--){
            arr[i] = null;
        }
        return arr;
    },

    isCorridoor: function(walls,floors){
        function rowcheck(arr){
            return arr[0] && !arr[1] && arr[2];
        }

        return (
                    _(walls[0]).compact().length == 3 &&
                    _(floors[1]).compact().length == 3 &&
                    _(walls[2]).compact().length == 3
                )
                ||
                (
                    _(walls).chain().map(function(row){ return rowcheck(row); }).compact().size().value() === 3
                );
    },

    makeFloorTile: function(tileinfo){
        /*
        tileinfo.numfloors
        tileinfo.numwalls 
        tileinfo.floors
        tileinfo.walls 
        tileinfo.tiletype*/
        var tile = {},
            switchFloor = Math.random() > 0.7;
        tile.walkable = true;
        tile.fillStyle = '#99FF99';
        tile.spriteinfo = {
            x: switchFloor ? Math.ceil(Math.random() * 6) * 40 : 40,
            y: 0
        };

        if(
            this.isCorridoor(tileinfo.walls,tileinfo.floors)
        ){
            // coridoor tile
            tile.spriteinfo.x = 0;
        }

        return tile;
    },

    // picks a tile type based on the information provided
    makeTile: function(tileinfo){
        var tiletype = tileinfo.tiletype,
            tile = {
                type: tiletype,
                walkable: false,
                collisionmap: [],
                spriteinfo: {},
                fillStyle: '#000000'
            };

        switch(tiletype){
            case 'f':
                tile = _(tile).extend(this.makeFloorTile(tileinfo));
                break;
        }
        return tile;
    },

    decorateTile: function(coords){
    	var adjacent = this.adjacentTiles(coords),
    		tile = this.tileExists(coords) ? this.map[coords.y][coords.x] : '',
    		adjacentFloors = 0,
    		adjacentWalls = 0,
            floors = [],
            walls = [],
            rowfloors,
            rowwalls,
            self = this;

    	// iterate over each row and increase scores
    	_(adjacent).each(function(row,i){
            rowfloors = self.makeNullFilledArray(3),
            rowwalls = self.makeNullFilledArray(3),
    		 _(row).each(function(neighbortile,j){
    			switch(neighbortile){
    				case 'f':
    					adjacentFloors++;
                        rowfloors[j] = true;
    					break;
    				default:
    					adjacentWalls++;
                        rowwalls[j] = true;
    					break;
    			}
    		});
            floors.push(rowfloors);
            walls.push(rowwalls);
    	});

    	// return tile type based on surrounding tiles
	    return this.makeTile({
	    	numfloors: adjacentFloors,
	    	numwalls: adjacentWalls,
            floors: floors,
            walls: walls,
	    	tiletype: tile
	    });
    },

    decorate: function(map){
    	this.map = map;
    	var self = this,
    		tiles = [];
    	
    	_(map.length).times(function(){
			var row = [];
			_(map[0].length).times(function(){
				row.push('');
			});
			tiles.push(row);
		});
    		
    	_(map).each(function(row,i){
    		_(row).each(function(tiletype,j){
    			tiles[i][j] = self.decorateTile({x:j,y:i});
    		});
    	});
      return tiles;
    }

  };

});