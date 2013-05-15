define([
	'underscore',
	'backbone'
], function(
	_, 
	Backbone) {

	var ANIMATION_RATE = 2;

	var ExplosionModel = Backbone.Model.extend({

		initialize: function( atts, opts ) {					
			//listen to global frame advance
			this.collection.on('frame:advance', this.frame, this);
		},
		defaults : {
			'x': 0, //horizontal
			'y': 0, //vertical
			'f': 20, //frame count,
			'w': 26, //width
			'h': 26, //height
			'type': 'explosion',
		},
		frame: function() {
			var frameCount = this.get('f') - ANIMATION_RATE;
			this.set('f', frameCount);
			if(frameCount <= 0) {
				this.collection.off('frame:advance', this.frame, this);
				this.destroy();
			}			
		}
	});
	
	return ExplosionModel;
});
