function CycleController() {

	function randIdx(list) {
		return Math.floor(Math.random()*list.length);
	}

	this.delete = function(cycleId) {
		var curCycle = world.cycles[cycleId];
		if (curCycle) {
			this.resetVisitedTargets(curCycle);
			delete world.cycles[cycleId];
		}
	}

	this.resetVisitedTargets = function(cycle) {
		for (var i = 0; i < cycle.visitedTargets.length; i++) {
			var curTarget = world.targets[cycle.visitedTargets[i]];
			if (curTarget.visitedCycles) {
				curTarget.visitedCycles[cycle.id] = null;
				targetCtrl.save(curTarget);
			}
		}
	}

	this.respawn = function(cycle) {
		this.resetVisitedTargets(cycle);

		var prevTarget = world.getCorner();
		var curTarget = world.targets[prevTarget].neighbors[0];
		var nextTargetIdx = 0;
		var nextTarget = world.targets[curTarget].neighbors[nextTargetIdx];
		
		cycle.visitedTargets = [ prevTarget ];
		cycle.prevTarget = prevTarget;
		cycle.curTarget = curTarget;
		cycle.x = world.targets[prevTarget].x;
		cycle.y = world.targets[prevTarget].y;

		this.newHeading(cycle);
		this.selectTargetClosestTo(cycle, $V(cycle.heading));

		targetCtrl.visit(world.targets[prevTarget], cycle.id);

		this.save(cycle);
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
		if (distanceToCurTarget < cycle.speed) { // cycle has arrived
			if (cycle.id == myId.name()) { // only handle collisions for your own cycle
				if (isEmptyObj(curTarget.visitedCycles)) { // visit the target
					cycle.visitedTargets.push(cycle.curTarget);
					targetCtrl.visit(curTarget, cycle.id);
					this.newTarget(cycle);
					cycleCtrl.save(cycle);
				}
				else { // the target is already visited
					console.log("RESPAWNING",cycle.curTarget);
					this.respawn(cycle);
				}
			}
			else {
				this.newTarget(cycle);
			}
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

		// console.log("JUST VISITED",cycle.prevTarget);
		// console.log("NOW HEADING TO",cycle.curTarget);
		// console.log("AND AFTER THAT",cycle.nextTarget);
	}

	this.draw = function(cycle) {
		var visitedTargets = cycle.visitedTargets;
		ctx.beginPath();
		ctx.moveTo(world.targets[visitedTargets[0]].x, world.targets[visitedTargets[0]].y);
		for (var i = 1; i < visitedTargets.length; i++) {
			var curTarget = world.targets[visitedTargets[i]];
			ctx.lineTo(curTarget.x,curTarget.y);
		}
		ctx.lineTo(cycle.x,cycle.y);
		// ctx.arc(cycle.x, cycle.y, 5, 0, 2*Math.PI, false);
		// ctx.fillStyle = cycle.color;
		// ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = cycle.color;
		ctx.stroke();
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