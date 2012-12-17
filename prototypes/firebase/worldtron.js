var GAME_LOCATION = "https://worldtron.firebaseIO.com/";
var gameRef, usersRef, cycleRef, worldRef;
var myId, targetCtrl, cycleCtrl, inputCtrl;
var world;

$(document).ready(function() {
	// init Firebase refs
	gameRef = new Firebase(GAME_LOCATION);
	usersRef = gameRef.child("users");
	worldRef = gameRef.child("world");

	myId = usersRef.push({"logged_on":"true"});
	myId.removeOnDisconnect();
	
	cycleRef = worldRef.child("cycles/"+myId.name());
	cycleRef.removeOnDisconnect();

	// usersRef.on("child_added", function(userSnapshot) {
	// 	console.log(userSnapshot.name() + " added to users. My name is " + myId.name());
	// 	if (userSnapshot.name() != myId.name()) {
	// 		userSnapshot.child("cycle").ref().once("value", function(cycleSnapshot) {
	// 			console.log("Creating cycle for " + userSnapshot.name());				
	// 			var cycleId = cycleSnapshot.child("id").val();
	// 			world.cycles[cycleId] = new Cycle(cycleSnapshot.val());

	// 			userSnapshot.child("cycle").ref().on("value", function(cycleSnapshot) {
	// 				console.log(userSnapshot.name() + "'s cycle updated!");
	// 				console.log(cycleSnapshot.val());
	// 				var cycleId = cycleSnapshot.child("id").val();
	// 				world.cycles[cycleId].update(cycleSnapshot.val());
	// 			});
	// 		});
	// 	}
	// });

	cycleCtrl = new CycleController();
	targetCtrl = new TargetController();

	// load the world
	worldRef.once("value", function(worldSnapshot) {
		console.log("world",worldSnapshot.val());
		world = new World(worldSnapshot.val());

		// init cycle
		var prevTarget = world.getCorner();
		var curTarget = world.targets[prevTarget].neighbors[0];
		var nextTargetIdx = 0;
		var nextTarget = world.targets[curTarget].neighbors[nextTargetIdx];
		var myColor = "hsl(" + Math.floor(Math.random()*360) + ",100%,70%)";
		var myCycle = {
			speed: 5,
			color: myColor,
			prevTarget: prevTarget,
			curTarget: curTarget,
			nextTargetIdx: nextTargetIdx,
			nextTarget: nextTarget,
			x: world.targets[prevTarget].x,
			y: world.targets[prevTarget].y
		};

		cycleCtrl.newHeading(myCycle);
		cycleCtrl.save(myCycle);

		inputCtrl = new CardinalInput(myId.name());
	});

	// init canvas
	ctx = $("#canvas")[0].getContext("2d");
	canvas = $("#canvas")[0];
	
	// init resize behavior
	$(window).onresize = sizeToWindow();

	// init input listeners
	document.onkeydown = keyDown;

	drawBackground();

	window.setInterval(step, 20);
	
});

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
		cycleCtrl.drawOptions(world.cycles[myId.name()]);
	}
}

function sizeToWindow() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function keyDown(evt) {
	console.log(myId.name());
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
