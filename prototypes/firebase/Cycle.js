function CycleController() {

	function randIdx(list) {
		return Math.floor(Math.random()*list.length);
	}

	this.newHeading = function(cycle) {
		var curTargetPos = $V([world.targets[cycle.curTarget].x, world.targets[cycle.curTarget].y]);
		var prevTargetPos = $V([world.targets[cycle.prevTarget].x, world.targets[cycle.prevTarget].y]);
		var newHeading = curTargetPos.subtract(prevTargetPos).toUnitVector();
		cycle.heading = [newHeading.e(1), newHeading.e(2)];
	}

	this.save = function(cycle) {
		cycleRef.set(cycle);
	}

	this.step = function(cycle) {
		var heading = $V(cycle.heading);
		var pos = $V([cycle.x, cycle.y]);
		var curTarget = world.targets[cycle.curTarget];
		var distanceToCurTarget = pos.distanceFrom($V([curTarget.x,curTarget.y]));
		if (distanceToCurTarget < cycle.speed) {
			this.newTarget(cycle);
		}
		var dPos = Math.min(distanceToCurTarget, cycle.speed);
		pos = pos.add(heading.x(dPos));
		cycle.x = pos.e(1);
		cycle.y = pos.e(2);
	}

	this.newTarget = function(cycle) {
		var curTarget = world.targets[cycle.curTarget];
		var nextTarget = world.targets[cycle.nextTarget];
		
		cycle.prevTarget = cycle.curTarget;
		cycle.curTarget = cycle.nextTarget;

		this.newHeading(cycle);

		this.selectTargetClosestTo(cycle, $V(cycle.heading));
	}

	this.draw = function(cycle) {
		ctx.fillStyle = cycle.color;
		ctx.beginPath();
		ctx.arc(cycle.x, cycle.y, 5, 0, 2*Math.PI, false);
		ctx.closePath();
		ctx.fill();
	}

	this.drawOptions = function(cycle) {
		var curTarget = world.targets[cycle.curTarget];
		var nextTarget = world.targets[cycle.nextTarget];
		for (var i = 0; i < curTarget.neighbors.length; i++) {
			targetCtrl.drawHighlight(world.targets[curTarget.neighbors[i]], cycle.color);
		}
		targetCtrl.drawSelect(nextTarget, cycle.color);
	}

	this.setTarget = function(cycle, idx) {
		var curTarget = world.targets[cycle.curTarget];
		cycle.nextTargetIdx = idx;
		cycle.nextTarget = curTarget.neighbors[cycle.nextTargetIdx];
	}

	this.selectTargetClosestTo = function(cycle, direction) {
		var curPos = $V([world.targets[cycle.curTarget].x, world.targets[cycle.curTarget].y]);
		var dist =  Math.PI*2;
		var optionIdx = 0;
		var options = world.targets[cycle.curTarget].neighbors;
		for (var i = 0; i < options.length; i++) {
			console.log(options[i]);
			var optionDir = $V([world.targets[options[i]].x, world.targets[options[i]].y]).subtract(curPos);
			var curDist = direction.angleFrom(optionDir);
			if (curDist < dist) {
				dist = curDist;
				optionIdx = i;
			}
		}
		this.setTarget(cycle, optionIdx);
	}

}