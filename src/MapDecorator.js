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

    // picks a tile type based on the information provided
    pickTile: function(tileinfo){
    	var tile = tileinfo.tiletype;
    	if(tileinfo.numfloors>8){
    		tile = 'f1';
    	}else if(tileinfo.numwalls>4 && tile === 'f'){
    		tile = 'f0';
    	}else if(tileinfo.numwalls>8 && tile !== 'f'){
    		tile = 'w0';
    	}
    	return tile;
    },

    decorateTile: function(coords){
    	var adjacent = this.adjacentTiles(coords),
    		tile = this.tileExists(coords) ? this.map[coords.y][coords.x] : '',
    		adjacentFloors = 0,
    		adjacentWalls = 0;

    	// iterate over each row and increase scores
    	_(adjacent).each(function(row,i){
    		 _(row).each(function(neighbortile,j){
    			switch(neighbortile){
    				case 'f':
    					adjacentFloors++;
    					break;
    				default:
    					adjacentWalls++;
    					break;
    			}
    		});
    	});

    	// return tile type based on score
	    return this.pickTile({
	    	numfloors: adjacentFloors,
	    	numwalls: adjacentWalls,
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