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
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.beginPath();
		ctx.arc(target.x, target.y, 6, 0, 2*Math.PI, false);
		ctx.closePath();
		ctx.fill();
	}

}