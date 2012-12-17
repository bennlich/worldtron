function World(world) {

	this.targets = {};
	this.cycles = {};
	this.spacing = 100;

	this.spawnWorld = function() {
		for (var i = 0; i < canvas.width; i+=this.spacing) {
			for (var j = 0; j < canvas.height; j+=this.spacing) {
				var newTarget = {
					x: i,
					y: j,
					neighbors: []
				};
				if (i > 0) newTarget.neighbors.push((i-this.spacing)+"_"+j);
				if (j > 0) newTarget.neighbors.push(i+"_"+(j-this.spacing));
				if (i < canvas.width - this.spacing) newTarget.neighbors.push((i+this.spacing)+"_"+j);
				if (j < canvas.height - this.spacing) newTarget.neighbors.push(i+"_"+(j+this.spacing));
				this.targets[i+"_"+j] = newTarget;
				console.log(newTarget);
			}
		}
		this.save();
	}

	this.save = function() {
		worldRef.set({
			targets: this.targets,
			cycles: this.cycles
		});
	}

	this.getCorner = function() {
		switch (Math.floor((Math.random()*4)+1)) {
			case 1: // NW
				return 0+"_"+0;
			break;
			case 2: // NE
				return (Math.floor(canvas.width/this.spacing)*this.spacing)+"_"+0;
			break;
			case 3: // SE
				return (Math.floor(canvas.width/this.spacing)*this.spacing)+"_"+(Math.floor(canvas.height/this.spacing)*this.spacing);
			break;
			case 4: // SW
				return 0+"_"+(Math.floor(canvas.height/this.spacing)*this.spacing);
			break;
		}
	}

	if (!world) {
		this.spawnWorld();
	}
	else {
		this.targets = world.targets;
		this.cycles = world.cycles;
	}

	// listen for changes to game state
	var self = this;
	worldRef.on("value", function(worldSnapshot) {
		self.targets = worldSnapshot.child("targets").val();
		self.cycles = worldSnapshot.child("cycles").val();
	});

}