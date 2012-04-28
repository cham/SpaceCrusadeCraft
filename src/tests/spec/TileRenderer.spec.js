describe("TileRenderer", function() {

  describe('initialisation methods',function(){

    var $map = $('<div/>');

    beforeEach(function(){
      TileRenderer.setEl($map);

      TileRenderer.setOptions({
        tilewidth: 10,
        tileheight: 10
      });
    });

    afterEach(function(){
      TileRenderer.$el = null;
      //TileRenderer.
    });

    it('Sets the container element correctly',function(){
      expect(TileRenderer.$el).toEqual($map);
      expect(TileRenderer.$el.html()).toContain('<canvas');
    });

    describe('Dimensions',function(){

      beforeEach(function(){
        TileRenderer.setDimensions(100,50);
      });
      
      it('Sets TileRenderer object dimension properties correctly',function(){
        expect(TileRenderer.width).toEqual(100);
        expect(TileRenderer.height).toEqual(50);

      });

      it('Sets DOM elements dimensions correctly',function(){
        var $canvas = TileRenderer.$el.find('canvas');

        expect(TileRenderer.$el.width()).toEqual(100);
        expect(TileRenderer.$el.height()).toEqual(50);
        expect($canvas.width()).toEqual(100);
        expect($canvas.height()).toEqual(50);
        expect($canvas.attr('width')).toEqual('100');
        expect($canvas.attr('height')).toEqual('50');
      });

      it('Sets viewport dimensions correctly',function(){
        expect(TileRenderer.viewport.tileswide).toEqual(10);
        expect(TileRenderer.viewport.tileshigh).toEqual(5);
      });
    });
  });

});