/**
* AStarFloodFill
* Fork of Matthew Trost's A-Star Pathfinding Algorithm by D Neame @cham
* Adds delayed flood filling support
*
* @license Creative Commons Attribution-ShareAlike 3.0 Unported License
* @datepublished December 2010
*/


/**

map format 2D Array:
	u = unwalkable, w = walkable, s = start , g = goal
	if map is not sane (no u,w,s and g) then does not fail gracefully
	map format e.g.: 
	[ ["u", "u", "u", "u", "u"],  
	["w", "w", "w", "w", "g"],  
	["w", "w", "u", "w", "w"],  
	["s", "w", "u", "w", "w"],  
	["u", "u", "u", "w", "w"] ]


Following are set in the returned object:

heuristic
	"manhattan" – the speedy Manhattan method, which adds up the x and y distance
	"diagonal" – uses a diagonal line, plus any remaining x/y distance
	"euclidean" – The familiar, elementary distance formula, accurate but slow

cutCorners
	The cutCorners parameter, which accepts a Boolean argument, specifies whether the path can include any diagonal steps – including steps between two unwalkable nodes situated diagonally:
	true – corners may be cut (i.e., diagonal movement is allowed)
	false – corners may not be cut

**/
define(function(){
	'use strict';

	/*
	 * original astar source
	 */
	function astar (map, heuristic, cutCorners) {
		var listOpen = [];
		var listClosed = [];
		var listPath = [];
		var nodeGoal = createTerminalNode(map, heuristic, "g", null);
		var nodeStart = createTerminalNode(map, heuristic, "s", nodeGoal);
		addNodeToList(nodeStart, listOpen);
		
		var n;
		while (!isListEmpty(listOpen)) {
			n = returnNodeWithLowestFScore(listOpen);
			addNodeToList(n, listClosed);
			removeNodeFromList(n, listOpen);
			if (areNodesEqual(n, nodeGoal)) {
				pathTo(n, listPath);
				listPath.reverse();
				return listPath;
			}
			n.makeChildNodes(map, heuristic, cutCorners, nodeGoal);
			cullUnwantedNodes(n.childNodes, listOpen);
			cullUnwantedNodes(n.childNodes, listClosed);
			removeMatchingNodes(n.childNodes, listOpen);
			removeMatchingNodes(n.childNodes, listClosed);
			addListToList(n.childNodes, listOpen);
		}
		return null;
	}

	function pathTo (n, listPath) {
		listPath.push(new NodeCoordinate(n.row, n.col));
		if (n.parentNode == null)
			return;
		pathTo(n.parentNode, listPath);
	}

	function addListToList(listA, listB) {
		var x;
		for (x in listA)
			listB.push(listA[x]);
	}

	function removeMatchingNodes (listToCheck, listToClean) {
		var listToCheckLength = listToCheck.length;
		for (var i = 0; i < listToCheckLength; i++) {
			for (var j = 0; j < listToClean.length; j++) {
				if (listToClean[j].row == listToCheck[i].row && listToClean[j].col == listToCheck[i].col)
					listToClean.splice(j, 1);
			}
		}
	}

	function cullUnwantedNodes (listToCull, listToCompare) {
		var listToCompareLength = listToCompare.length;
		for (var i = 0; i < listToCompareLength; i++) {
			for (var j = 0; j < listToCull.length; j++) {
				if (listToCull[j].row == listToCompare[i].row && listToCull[j].col == listToCompare[i].col) {
					if (listToCull[j].f >= listToCompare[i].f)
						listToCull.splice(j, 1);
				}
			}
		}
	}

	function areNodesEqual (nodeA, nodeB) {
		if (nodeA.row == nodeB.row && nodeA.col == nodeB.col)
			return true;
		else
			return false;
	}

	function returnNodeWithLowestFScore (list) {
		var lowestNode = list[0], x;
		for (x in list)
			lowestNode = (list[x].f < lowestNode.f) ? list[x] : lowestNode;
		return lowestNode;
	}

	function isListEmpty (list) {
		return (list.length < 1) ? true : false;
	}

	function removeNodeFromList (node, list) {
		var listLength = list.length;
		for (var i = 0; i < listLength; i++) {
			if (node.row == list[i].row && node.col == list[i].col) {
				list.splice(i, 1);
				break;
			}
		}
	}

	function addNodeToList (node, list) {
		list.push(node);
	}

	function createTerminalNode (map, heuristic, nodeType, nodeGoal) {
		var mapRows = map.length;
		var mapCols = map[0].length;
		for (var row = 0; row < mapRows; row++) {
			for (var col = 0; col < mapCols; col++) {
				if (map[row][col] == nodeType) {
					return new Node(row, col, map, heuristic, null, nodeGoal);
				}
			}
		}
		return null;
	}

	function returnHScore (node, heuristic, nodeGoal) {
		var y = Math.abs(node.row - nodeGoal.row);
		var x = Math.abs(node.col - nodeGoal.col);
		switch (heuristic) {
			case "manhattan":
				return (y + x) * 10;
			case "diagonal":
				return (x > y) ? (y * 14) + 10 * (x - y) : (x * 14) + 10 * (y - x);
			case "euclidean":
				return Math.sqrt((x * x) + (y * y));
			default:
				return null;
		}
	}

	function NodeCoordinate (row, col) {
		this.row = row;
		this.col = col;
	}

	function Node (row, col, map, heuristic, parentNode, nodeGoal) {
		var mapLength = map.length;
		var mapRowLength = map[0].length;
		this.row = row;
		this.col = col;
		this.northAmbit = (row == 0) ? 0 : row - 1;
		this.southAmbit = (row == mapLength - 1) ? mapLength - 1 : row + 1;
		this.westAmbit = (col == 0) ? 0 : col - 1;
		this.eastAmbit = (col == mapRowLength - 1) ? mapRowLength - 1 : col + 1;
		this.parentNode = parentNode;
		this.childNodes = [];

		if (parentNode != null) {
			if (row == parentNode.row || col == parentNode.col)
				this.g = parentNode.g + 10;
			else
				this.g = parentNode.g + 14;
			this.h = returnHScore(this, heuristic, nodeGoal);
		}
		else {
			this.g = 0;
			if (map[row][col] == "s")
				this.h = returnHScore(this, heuristic, nodeGoal);
			else
				this.h = 0;
		}
		this.f = this.g + this.h;
		
		this.makeChildNodes = function (map, heuristic, cutCorners, nodeGoal) {
			for (var i = this.northAmbit; i <= this.southAmbit; i++) {
				for (var j = this.westAmbit; j <= this.eastAmbit; j++) {
					if (i != this.row || j != this.col) {
						if (map[i][j] != "u") {
							if (cutCorners == true) 
								this.childNodes.push(new Node(i, j, map, heuristic, this, nodeGoal));
							else {
								if (i == this.row || j == this.col)
									this.childNodes.push(new Node(i, j, map, heuristic, this, nodeGoal));	
							}
						}
					}
				}
			}
		};
	}

	function spiral(size,outwards){
		var i, k, j=0,ret=[],
			pushFn = outwards ?	function(a,b){ a.unshift(b); } :
								function(a,b){ a.push(b); };
		for(i = size; i >=0; i--){
			for(k=j; k < i; k++){
				pushFn(ret,{x:j,y:k});//ret.push({x:j,y:k});
			}
			for(k=j; k < i; k++) {
				pushFn(ret,{x:k,y:i});//ret.push({x:k,y:i});
			}
			for(k=i; k > j; k--){
				pushFn(ret,{x:i,y:k});//ret.push({x:i,y:k});
			}
			for(k=i; k > j; k--){
				pushFn(ret,{x:k,y:j});//ret.push({x:k,y:j});
			}
			j++;
		}
		return ret;
	}



	/*
	 * flood filler by D Neame @cham
	 */
	return {
		
		heuristic: 'manhattan',
		cutcorners: false,
		map: [],
		restoremap: [],
		weightmap: [],
		fillTimer: null,
		peak: {x:0,y:0},
		mapdims: {width:0,height:0,boxlength:0},
		updatesequence: [],
		intervalPerTile: 100,
		doneOne: null,
		doneAll: null,

		setMap: function(map){
			var w = map[0].length,
				h = map.length,
				self = this;

			this.map = map;
			this.mapdims = {
				width: w,
				height: h,
				boxlength: w > h ? w : h,
				numcells: this.map[0].length * this.map.length
			};
			this.spiralSeq = _(spiral(this.mapdims.boxlength)).filter(function(coord){
				return self.tileInMap(coord) && self.walkableTile(coord);
			});
			this.weightmap = _(this.map).reduce(function(memo,item){
				var arr = [];
				_(self.mapdims.width).times(function(){
					arr.push(Infinity);
				});
				memo.push(arr);
				return memo;
			},[]);
		},

		clearProcessedCache: function(){
			this.cached = _(this.map).reduce(function(memo,item){
				memo.push([]);
				return memo;
			},[]);
		},

		peakMatches: function(coords){
			return this.peak.x === coords.x && this.peak.y === coords.y;
		},

		tileInMap: function(coords){
			return this.map[coords.y] && this.map[coords.y][coords.x];
		},

		walkableTile: function(coords){
			return this.map[coords.y] &&
				   this.map[coords.y][coords.x] &&
				   this.map[coords.y][coords.x] !== 'u';
		},

		setPeak: function(coords){
			if(this.peakMatches(coords)){
				return;
			}

			this.peak = coords;
			this.setPeakWeight();
		},

		setTileInterval: function(intervalPerTile){
			this.intervalPerTile = intervalPerTile;
		},

		setCallbacks: function(doneOne,doneAll){
			this.doneOne = doneOne;
			this.doneAll = doneAll;
		},

		setPeakWeight: function(){
			this.weightmap[this.peak.y][this.peak.x] = 1;
		},

		startFill: function(){
			var self = this,
				passEstimate = this.intervalPerTile*(this.mapdims.numcells+1);

			function runFill(){
				var drawcount = 0;

				self.clearProcessedCache();
				_(self.spiralSeq).each(function(coords,i){

					drawcount++;
					self.fillTimer = window.setTimeout(function(){

						self.fillPathLength(coords);

						if(self.doneOne) { self.doneOne(); }

						// if done all
						if(i === self.spiralSeq.length-1) {
							if(self.doneAll) { self.doneAll(); }
							runFill();
						}

					},self.intervalPerTile*drawcount);
				});
			}
			
			runFill();

		},

		getPath: function(myCoords){
			var testmap = this.map, astarres,
				tileType = testmap[myCoords.y][myCoords.x],
				goalTileType = testmap[this.peak.y][this.peak.x];

			testmap[myCoords.y][myCoords.x] = 's';
			this.map[this.peak.y][this.peak.x] = 'g';
		
			try {
				astarres = astar(testmap,this.heuristic,this.cutcorners);
				}catch(e){}

			testmap[myCoords.y][myCoords.x] = tileType;
			this.map[this.peak.y][this.peak.x] = goalTileType;
			return astarres;
		},

		fillPathLength: function(coords){
			var astarPath, pathlen, self = this,
				x = coords.x,
				y = coords.y;

			if (this.cached[y][x]){
				return;
			} else if (!this.walkableTile(coords)) {
				this.weightmap[y][x] = Infinity;
				return;
			} else if (this.peakMatches(coords)) {
				this.weightmap[y][x] = 0;
				return;
			}

			astarPath = this.getPath(coords);
			if(astarPath && astarPath.length){
				pathlen = astarPath.length;
				_(astarPath).each(function(item,i){
					self.weightmap[item.row][item.col] = pathlen - i;
					self.cached[item.row][item.col] = true;
				});
			}
		},

		lowestNeighborTo: function(coords){
			var map = this.getWeightmap(),
				bbox = {
					'top': coords.y-1 < 0 ? 0 : coords.y-1,
					'right': coords.x+1 > map[0].length ? map[0].length : coords.x+1,
					'bottom': coords.y+1 > map.length ? map.length : coords.y+1,
					'left': coords.x-1 < 0 ? 0 : coords.x-1
				},
				lowval = Infinity,
				lowest = {x:0,y:0},
				topslice=[],midslice=[],bottomslice=[];

			topslice = (map.slice(bbox.top,bbox.top+1)[0] || []).slice(bbox.left,bbox.right+1);
			if(coords.y!==bbox.top){
				midslice = (map.slice(coords.y,coords.y+1)[0] || []).slice(bbox.left,bbox.right+1);
			}
			bottomslice = (map.slice(bbox.bottom,bbox.bottom+1)[0] || []).slice(bbox.left,bbox.right+1);

			_(topslice).each(function(item,i){
				if(item>lowval){ return; }
				lowval = item;
				lowest = {x:bbox.left+i,y:bbox.top};
			});
			_(midslice).each(function(item,i){
				if(item>lowval){ return; }
				lowval = item;
				lowest = {x:bbox.left+i,y:bbox.top+1};
			});
			_(bottomslice).each(function(item,i){
				if(item>lowval){ return; }
				lowval = item;
				lowest = {x:bbox.left+i,y:bbox.bottom};
			});

		  return lowest;
		},

		getWeightmap: function(){
			return this.weightmap;
		},

		stop: function(){
			window.clearTimeout(this.fillTimer);
		},

		/*
		 * aka init, also starts the fill
		 */
		start: function(opt){
			var options = _(opt || {}).defaults({
					map: [ ['w','w','w'],
						   ['w','u','w'],
						   ['w','w','w'] ],
					interval: 10,
					peak: {x:0,y:0},
					doneOne: null,
					doneAll: null
				});

			this.setTileInterval(options.interval);
			this.setCallbacks(options.doneOne, options.doneAll);

		    this.setMap(options.map);
			this.setPeak(options.peak);

			this.startFill();
		}

	};

});
