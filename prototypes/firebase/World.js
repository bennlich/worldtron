function World(world) {

	this.targets = {};
	this.cycles = {};
	this.spacing = 100;

	this.spawnWorld = function() {
		console.log("SPAWNING WORLD");
		for (var i = 0; i < canvas.width; i+=this.spacing) {
			for (var j = 0; j < canvas.height; j+=this.spacing) {
				var newTarget = {
					id: i+"_"+j,
					x: i,
					y: j,
					neighbors: []
				};
				if (i > 0) newTarget.neighbors.push((i-this.spacing)+"_"+j);
				if (j > 0) newTarget.neighbors.push(i+"_"+(j-this.spacing));
				if (i < canvas.width - this.spacing) newTarget.neighbors.push((i+this.spacing)+"_"+j);
				if (j < canvas.height - this.spacing) newTarget.neighbors.push(i+"_"+(j+this.spacing));
				this.targets[i+"_"+j] = newTarget;
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
		if (world.targets) this.targets = world.targets;
		if (world.cycles) this.cycles = world.cycles;
	}

	// listen for changes to game state
	var self = this;
	worldRef.child("cycles").on("child_removed", function(cycleSnapshot) {
		var cycleId = cycleSnapshot.child("id").val();
		console.log("REMOVING CHILD", cycleId);
		if (cycleId) cycleCtrl.delete(cycleId);
	});
	worldRef.child("cycles").on("child_changed", function(cycleSnapshot) {
		var cycleId = cycleSnapshot.child("id").val();
		if (cycleId) self.cycles[cycleId] = cycleSnapshot.val();
	});
	worldRef.child("cycles").on("child_added", function(cycleSnapshot) {
		var cycleId = cycleSnapshot.child("id").val();
		if (cycleId) self.cycles[cycleId] = cycleSnapshot.val();
	});

	worldRef.child("targets").on("child_changed", function(targetSnapshot) {
		var targetId = targetSnapshot.child("id").val();
		if (targetId) self.targets[targetId] = targetSnapshot.val();
	});

}