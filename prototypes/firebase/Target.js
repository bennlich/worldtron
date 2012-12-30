function TargetController() {

	this.spawnNeighbors = function(num, chainlength) {
		if (chainlength > 0) {
			for (var i = 0; i < num; i++) {
				var newTarget = new Target(chainlength, [this]);
				this.neighbors.push(newTarget);
				world.targets.push(newTarget);
			}
		}
	}

	this.visit = function(target, cycleId) {
		if (!target.visitedCycles) target.visitedCycles = {};
		target.visitedCycles[cycleId] = true;
		this.save(target);
	}

	this.save = function(target) {
		targetsRef.child(target.id).set(target);
	}

	this.drawHighlight = function(target, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(target.x, target.y, 8, 0, 2*Math.PI, false);
		ctx.closePath();
		ctx.fill();
	}

	this.drawSelect = function(target, color) {
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.arc(target.x, target.y, 16, 0, 2*Math.PI, false);
		ctx.closePath();
		ctx.stroke();
	}

	this.draw = function(target) {
		if (target.visitedCycles) ctx.fillStyle = "rgb(0,255,0)";
		else ctx.fillStyle = "rgb(255,255,255)";
		ctx.beginPath();
		ctx.arc(target.x, target.y, 6, 0, 2*Math.PI, false);
		ctx.closePath();
		ctx.fill();
	}

}