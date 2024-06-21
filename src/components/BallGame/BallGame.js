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
    waiting;

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
                wireframes: false
            }
        });

        this.Render.run(this.render);

        // create runner
        this.runner = this.Runner.create();
        this.Runner.run(this.runner, this.engine);

        // add bodies
        var rows = 10,
            yy = 600 - 21 - 40 * rows;

        let _self = this;
        var stack = this.Composites.stack(400, yy, 5, rows, 0, 0, function (x, y) {
            return _self.Bodies.circle(x * 1.1, y * 1.1, 40, { render: { fillStyle: _self.colors[Math.floor(_self.colors.length * Math.random())] } });
        });

        this.World.add(this.world, [
            stack,
            // walls. Hug the edges of the window
            this.Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 20, { isStatic: true }),
            this.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, { isStatic: true }),
            this.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true }),
            this.Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true })

        ]);

        var ball = this.Bodies.circle(100, 400, 50, { density: 0.04, frictionAir: 0.005 });

        this.World.add(this.world, ball);

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

        Matter.Events.on(this.engine, 'collisionStart', function (event) {
            // loop through all pairs, merge if they are touching
            var pairs = event.pairs;
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                if (pair.bodyA.render.fillStyle === pair.bodyB.render.fillStyle && pair.bodyA.circleRadius === pair.bodyB.circleRadius) {
                    _self.Body.scale(pair.bodyB, 1.5, 1.5);
                    // remove the body from the world
                    _self.Composite.remove(stack, pair.bodyB);
                    _self.Composite.remove(stack, pair.bodyA);

                }
            }
        });

        // create a fixed ball at the top that mimics the x position of the mouse
        this.nextBall = this.Bodies.circle(100, 50, 50, { isStatic: true });
        // fill
        this.nextBall.render.fillStyle = Math.floor(Math.random() * _self.colors.length);

        this.World.add(this.world, this.nextBall);
        this.Events.on(this.engine, 'beforeUpdate', function () {
            if(!_self.nextBall.isStatic) return;
            _self.Body.setPosition(_self.nextBall, { x: mouse.position.x, y: 75 });
            _self.nextBall.render.opacity = 1;
        });

        // on click add physics to the ball
        this.waiting = false;
        document.body.addEventListener('click', function () {
            if(_self.waiting) return;
            _self.waiting = true;
            _self.Body.setStatic(_self.nextBall, false);
            // add to stack
            _self.Composite.add(_self.world, _self.nextBall);
            setTimeout(function () {
                _self.waiting = false;
            _self.nextBall = _self.Bodies.circle(100, 50, 50, { isStatic: true, render: {opacity: 0} });
        
                // fill
                _self.nextBall.render.fillStyle = _self.colors[Math.floor(_self.colors.length * Math.random())];

                _self.World.add(_self.world, _self.nextBall);
                
            }, 1000);
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

// create demo interface
// not required to use Matter.js

new BallGame();