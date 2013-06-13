define([
	'underscore', 
	'model/TankModel',
	'model/SmallTankModel',
	'model/MediumTankModel',
	'model/SpecialTankModel',
	'model/BarrierModel',
	'model/ExplosionModel',
	'model/LifeModel'
	],

	function(_, TankModel, SmallTankModel, MediumTankModel, SpecialTankModel, BarrierModel, ExplosionModel, LifeModel) {

	var elements = {
		'large-tank': TankModel,
		'small-tank': SmallTankModel,
		'medium-tank': MediumTankModel,
		'special-tank': SpecialTankModel,
		'barrier': BarrierModel,
		'life': LifeModel,
		'explosion': ExplosionModel
	};
		
	return {
		
		create: function(element, attributes, options, socket) {

			if(_.isFunction(elements[element])) {
				return model = new elements[element](attributes, options);				
			} else {
				console.error("No Element called %s", element);
			}
		}
	};
});
