import Matter from "matter-js";
import MatterTools from "matter-tools";

// Matter.js - http://brm.io/matter-js/
export default class BallGame {

    colors = ['#FF6138', '#FFFF9D', '#BEEB9F', '#79BD8F', '#00A388'];

    Engine = Matter.Engine;
    Body = Matter.Body;
    Render = Matter.Render;
    Runner = Matter.Runner;
    Composites = Matter.Composites;
    Composite = Matter.Composite;
    MouseConstraint = Matter.MouseConstraint;
    Mouse = Matter.Mouse;
    World = Matter.World;
    Constraint = Matter.Constraint;
    Bodies = Matter.Bodies;
    Events = Matter.Events;

    engine;
    render;
    world;
    runner;
    nextBall;
    nextBallPlaceholder;
    waiting;
    stack;

    constructor() {
        // create engine
        this.engine = this.Engine.create();
        this.world = this.engine.world;

        // create renderer
        this.render = this.Render.create({
            element: document.body,
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
            }
        });

        this.Render.run(this.render);

        // create runner
        this.runner = this.Runner.create();
        this.Runner.run(this.runner, this.engine);

        // add bodies
        var rows = 10,
            yy = 600 - 21 - 40 * rows;



        this.World.add(this.world, [
        
            // walls. Hug the edges of the window
            this.Bodies.rectangle(this.render.options.width / 2, 0, this.render.options.width, 50, { isStatic: true }),
            this.Bodies.rectangle(this.render.options.width / 2, this.render.options.height, this.render.options.width, 50, { isStatic: true }),
            this.Bodies.rectangle(0, this.render.options.height / 2, 50, this.render.options.height, { isStatic: true }),
            this.Bodies.rectangle(this.render.options.width, this.render.options.height / 2, 50, this.render.options.height, { isStatic: true }),

        ]);

        // add mouse control
        var mouse = this.Mouse.create(this.render.canvas),
            mouseConstraint = this.MouseConstraint.create(this.engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        this.World.add(this.world, mouseConstraint);

        // keep the mouse in sync with rendering
        this.render.mouse = mouse;

        // fit the render viewport to the scene
        this.Render.lookAt(this.render, {
            min: { x: 0, y: 0 },
            max: { x: window.innerWidth, y: window.innerHeight }
        });

        let _self = this;

        // create empty group for only balls that can collide
        this.stack = this.Composites.stack(20, 20, 10, 10, 0, 0, function (x, y) {});

        Matter.Events.on(this.engine, 'collisionStart', function (event) {
            // loop through all pairs, merge if they are touching
            var pairs = event.pairs;
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                if (pair.bodyA.render.fillStyle === pair.bodyB.render.fillStyle && pair.bodyA.circleRadius === pair.bodyB.circleRadius) {

                    console.log('match', pair.bodyA, pair.bodyB);
                    Matter.Composite.remove(_self.world, pair.bodyA);
                    Matter.Composite.remove(_self.world, pair.bodyB);


                    // new ball, same color, bigger size
                    var newBall = _self.Bodies.circle((pair.bodyA.position.x + pair.bodyB.position.x) / 2, (pair.bodyA.position.y + pair.bodyB.position.y) / 2, pair.bodyA.circleRadius * 1.5, {
                        render: {
                            fillStyle: pair.bodyA.render.fillStyle
                        }
                    });
                    Matter.World.add(_self.world, newBall);

                }
            }
        });

        this.nextBallPlaceholder = this.Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, 20);
        // just an outline
        this.nextBallPlaceholder.render.strokeStyle = '#333';
        this.nextBallPlaceholder.render.lineWidth = 2;
        // no fill
        this.nextBallPlaceholder.render.fillStyle = 'transparent';
        this.nextBallPlaceholder.isStatic = true;
        // doesn't collide with other balls
        this.nextBallPlaceholder.collisionFilter.group = -1;
        Matter.World.add(this.world, this.nextBallPlaceholder);

        this.nextBall = this.Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, 20, {
            render: {
                fillStyle: this.colors[Math.floor(Math.random() * this.colors.length)]
            }
        });
        this.nextBall.isStatic = true;
        this.nextBall.collisionFilter.group = -1;
        Matter.World.add(this.world, this.nextBall);

        // on click spawn new ball
        document.body.addEventListener('click', function (event) {
            if (_self.waiting) return;
            _self.waiting = true;
            
            // add to stack
            _self.nextBall.collisionFilter.group = 1;
            
            _self.nextBall.isStatic = false;
            // move down a little
            _self.Body.setPosition(_self.nextBall, { x: _self.nextBall.position.x, y: 100 });
            Matter.Composite.add(_self.stack, _self.nextBall);
            // create new ball
            _self.nextBall = _self.Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, 20, {
                render: {
                    fillStyle: _self.colors[Math.floor(Math.random() * _self.colors.length)]
                }
            });
            _self.nextBall.isStatic = true;
            // doesn't collide with other balls
            _self.nextBall.collisionFilter.group = -1;
            // move to mouse position
            _self.Body.setPosition(_self.nextBall, { x: event.clientX, y: 50 });
            setTimeout(function () {
                Matter.World.add(_self.world, _self.nextBall);
                _self.waiting = false;
            }, 750);
        });

        // on mouse move, move the next ball
        document.body.addEventListener('mousemove', function (event) {
            let x = event.clientX;
            if(x < 50) x = 50;
            if(x > window.innerWidth - 20) x = window.innerWidth - 20;
            _self.Body.setPosition(_self.nextBall, { x, y: 50 });
            _self.Body.setPosition(_self.nextBallPlaceholder, { x, y: 50 });
        });

        // context for MatterTools.Demo
        return {
            engine: this.engine,
            runner: this.runner,
            render: this.render,
            canvas: this.render.canvas,
            stop: function () {
                Matter.Render.stop(this.render);
                Matter.Runner.stop(this.runner);
            }
        };

    }
};