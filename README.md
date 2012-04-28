# AStarFiller

AStar flood filler written in JS.
Fills a 2D map with integers representing each tile's distance from the goal.
Can be interrogated for 'next best move' to goal / hill peak.

## Demo

Demo here: http://dl.dropbox.com/u/2741750/scc/testmap.html

## Example Usage

```js
	/*
	 * 'w' = walkable tile
	 * 'u' = unwalkable tile
	 */

    var map = [
                ['w','w','w','w','u','w','w','w','w','w','w','w'],
                ['w','u','w','u','u','w','u','u','u','w','w','w'],
                ['w','u','w','w','u','w','u','w','w','w','w','w'],
                ['w','u','u','u','u','w','u','u','u','u','w','w'],
                ['w','w','w','u','w','w','w','w','u','w','w','w'],
                ['w','w','w','u','w','u','w','w','u','w','w','w'],
                ['u','u','w','w','w','u','w','u','u','u','u','w'],
                ['w','w','w','w','w','w','w','w','w','w','w','w'],
                ['w','u','u','w','u','u','u','u','w','u','u','w'],
                ['w','w','u','w','w','u','w','w','w','u','w','w'],
                ['w','w','u','w','w','u','w','w','w','w','w','w'],
                ['w','w','u','w','w','u','w','w','w','w','u','w'],
                ['w','w','u','u','w','u','w','w','u','u','u','w'],
                ['w','w','w','u','w','w','w','w','u','w','w','w'],
                ['w','w','w','w','w','u','w','w','u','w','w','w'],
                ['w','w','u','u','u','u','u','u','u','w','w','w']
            ];

    AStarFloodFill.start({
        map: map,
        peak: {x:7,y:7}, // sets the goal / player / peak of hill
        interval: 5 // execute every 5ms
    });

    // far away in your code, to get a reference to the current weight map:
    console.log(
	    AStarFloodFill.getWeightmap()
	);

    // alternatively, you can just ask for the next tile
    var bestMoveCoords = AStarFloodFile.lowestNeighborTo({
       x: 10,
       y: 7 
    });
```