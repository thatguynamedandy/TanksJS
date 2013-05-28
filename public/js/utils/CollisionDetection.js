define(['underscore'], function( _ ) {
		
	return {
		
		position: function(model, models, bounds) {

			var maxX = bounds.get('w') - model.attributes['w']
			,	maxY = bounds.get('h') - model.attributes['h'];

			//keep relocating something until you find an empty place
			while(this.detect(model, models) === true) {
				
				//FIXME using the 'set' method seems to locks hasChanged at true
				//use underlying attributes for the time being.
				model.attributes['x'] = _.random(0, maxX);
				model.attributes['y'] = _.random(0, maxY);
			};
		},
		
		//TODO: Optimise Optimise!!
		detect2 : function(model, collection, opts) {
		
			var opts = (typeof opts === "undefined") ? {} : opts
			,	hasIntersect = false
			,	top = model.get('y')
			,	left = model.get('x')
			,	bottom = top + model.get('h')
			,	right = left + model.get('w')
			,	id = model.get('id');

			_.each(collection, function(candidate) {
				
				if(id === candidate.get('id')) return; //don't compare the same object with itself
				
				var cLeft = candidate.get('x');
				if(!(left > cLeft)) {
					if(!(cLeft + candidate.get('w') > right)) {
						var cTop = candidate.get('h');
						if(!(top > cTop)) {
							if(!(cTop + candidate.get('h') > bottom)) {
								candidate.collide.call(candidate, model);
								model.collide.call(model, candidate);
								if(!hasIntersect) {
									hasIntersect = true;
								}
							}						
						}				
					}
				}						
			});

			return hasIntersect
		},
		
		detect : function(model, collection, opts) {
		
			var opts = (typeof opts === "undefined") ? {} : opts,
				hasIntersect = false;

			var top = model.get('y'),
				left = model.get('x'),
				bottom = top + model.get('h'),
				right = left + model.get('w'),
				id = model.get('id');

			_.each(collection, function(candidate) {

				var cid = candidate.get('id');
				
				if(id === cid) return; //don't compare the same object with itself
				
				var cTop = candidate.get('y'),
					cLeft = candidate.get('x'),
					cBottom = cTop + candidate.get('h'),
					cRight = cLeft + candidate.get('w');
				
				/*console.log("--start--")
				console.log((left > cRight))
				console.log((cLeft > right))
				console.log((top > cBottom))
				console.log((cTop > bottom))*/
				
				if(
					(opts.invert === true && (left > cLeft || cRight > right || top > cTop || cBottom > bottom)) || 
					(opts.invert !== true && !(left > cRight || cLeft > right || top > cBottom || cTop > bottom))
				) {

					//console.log("intersect");

					/*	I have an outstanding issue here, if the candidate is destroyed in the first callback,
						it may cause issues in the second. The way round it is probably to defer the deletion
						until the next frame. The temp quick fix I have attempted is a simple try catch.										
					*/

					if(!hasIntersect) {
						hasIntersect = true;
					}				
					if(_.isFunction(candidate[opts.callback])) {
						candidate[opts.callback].call(candidate, model);
					}
					if(_.isFunction(model[opts.callback])) {
						model[opts.callback].call(model, candidate);
					}
				}
			});

			return hasIntersect
		}
	}
});
