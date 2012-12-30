var GAME_LOCATION = "https://worldtron.firebaseIO.com/";
var gameRef, usersRef, cycleRef, targetsRef, worldRef;
var myId, targetCtrl, cycleCtrl, inputCtrl;
var world;

function init() {
	// init firebase refs
	gameRef = new Firebase(GAME_LOCATION);
	usersRef = gameRef.child("users");
	worldRef = gameRef.child("world");
	targetsRef = worldRef.child("targets");

	// load the game data
	gameRef.once("value", function(gameSnapshot) {
		
		var users = gameSnapshot.child("users").val();
		if (!users) {
			// if you're the first person in the game, build the world from scratch
			world = new World();
		}
		else {
			world = new World(gameSnapshot.child("world").val());
		}

		myId = usersRef.push({"logged_on":"true"});
		myId.removeOnDisconnect();
		
		console.log(myId.name());

		cycleRef = worldRef.child("cycles/"+myId.name());
		cycleRef.removeOnDisconnect();

		cycleCtrl = new CycleController();
		targetCtrl = new TargetController();

		// init your cycle
		var prevTarget = world.getCorner();
		var curTarget = world.targets[prevTarget].neighbors[0];
		var nextTargetIdx = 0;
		var nextTarget = world.targets[curTarget].neighbors[nextTargetIdx];
		var myColor = "hsl(" + Math.floor(Math.random()*360) + ",100%,70%)";
		var myCycle = {
			id: myId.name(),
			speed: 4,
			color: myColor,
			visitedTargets: [ prevTarget ],
			prevTarget: prevTarget,
			curTarget: curTarget,
			x: world.targets[prevTarget].x,
			y: world.targets[prevTarget].y
		};

		targetCtrl.visit(world.targets[prevTarget], myCycle.id);

		cycleCtrl.newHeading(myCycle);
		cycleCtrl.selectTargetClosestTo(myCycle, $V(myCycle.heading));
		cycleCtrl.save(myCycle);

		inputCtrl = new CardinalInput(myId.name());
	});

	// init canvas
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	
	// init resize behavior
	window.onresize = sizeToWindow();

	// init input listeners
	document.onkeydown = keyDown;

	drawBackground();

	window.setInterval(step, 20);

}

function drawBackground() {
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	if (world) {
		for (id in world.targets) {
			if (world.targets.hasOwnProperty(id)) {
				targetCtrl.draw(world.targets[id]);
			}
		}
	}
}

function step() {
	drawBackground();
	if (world && world.cycles) {
		for (id in world.cycles) {
			if (world.cycles.hasOwnProperty(id)) {
				cycleCtrl.step(world.cycles[id]);
				cycleCtrl.draw(world.cycles[id]);
			}
		}
		// cycleCtrl.drawOptions(world.cycles[myId.name()]);
	}
}

function sizeToWindow() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function keyDown(evt) {
	switch (evt.keyCode) {
		case 37: // left
			inputCtrl.left(world.cycles[myId.name()]);
		break;
		case 38: // up
			inputCtrl.up(world.cycles[myId.name()]);
		break;
		case 39: // right
			inputCtrl.right(world.cycles[myId.name()]);
		break;
		case 40: // down
			inputCtrl.down(world.cycles[myId.name()]);
		break;
	}
}
