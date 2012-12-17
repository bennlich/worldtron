function CardinalInput() {

	this.left = function(cycle) {
		var left = $V([-1,0]);
		cycleCtrl.selectTargetClosestTo(cycle, left);
		cycleCtrl.save(cycle);
	}

	this.right = function(cycle) {
		var right = $V([1,0]);
		cycleCtrl.selectTargetClosestTo(cycle, right);
		cycleCtrl.save(cycle);
	}

	this.up = function(cycle) {
		var up = $V([0,-1]);
		cycleCtrl.selectTargetClosestTo(cycle, up);
		cycleCtrl.save(cycle);
	}

	this.down = function(cycle) {
		var down = $V([0,1]);
		cycleCtrl.selectTargetClosestTo(cycle, down);
		cycleCtrl.save(cycle);
	}

}