/*
 * A class that draws a simple stylized side scrolling city scene.
 *
 * This code does not come with any sort of warranty.
 * You are welcome to use it for whatever you like.
 * A credit would be nice but is not required.
 */


function drawRect(context, x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function getRandomInt(minimum, maximum) {
    rand = minimum + Math.floor(Math.random() * (maximum - minimum + 1));
    return rand;
}

//http://ejohn.org/blog/simple-javascript-inheritance/#postcomment
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})();

Star = Class.extend({
    init: function(pos) {
        this.pos = pos;
    },
    update: function(dt) {
        multiplier = Math.floor((Date.now() - gGameTime)/1000);
        this.pos[0] -= dt * multiplier;
        
        //is this star still on screen?
        return this.pos[0] > 0;
    },
    draw: function(dt) {
        drawRect(gContext, this.pos[0], this.pos[1], 1, 1, 'white');
    }
});

StarField = Class.extend({
    stars: null,
    spacer: 10,
    init: function() {
        this.stars = Array();
    },
    update: function(dt) {
        var toRemove = Array(), nextX = 0;
        
        for (var i = 0;i < this.stars.length;i++) {
            if (!this.stars[i].update(dt)) {
                toRemove.push(i);
            } else {
                if (nextX < this.stars[i].pos[0] + this.spacer) {
                    nextX = this.stars[i].pos[0] + this.spacer;
                }
            }
        }
        //old stars
        for (var j = 0;j < toRemove.length;j++) {
            this.stars.splice(toRemove[j], 1);
        }
        //new stars
        var pos = null;
        while (nextX < gCanvas.width) {
            //no stars in bottom 40 pixels
            pos = [nextX, getRandomInt(0, gCanvas.height-40)];
            this.stars.push(new Star(pos));
            
            nextX = pos[0] + this.spacer;
        }
    },
    draw: function() {
        for (var i = 0;i < this.stars.length;i++) {
            this.stars[i].draw();
        }
    }
});

var gCanvas = document.getElementById('gamecanvas');
var gContext = gCanvas.getContext('2d');

function updateGame(dt) {
    gStarField.update(dt);
}

function drawGame() {
    gContext.fillStyle = "black";
    gContext.fillRect(0 , 0, gCanvas.width, gCanvas.height);
    //context.clearRect(0, 0, canvas.width, canvas.height);
    
    gStarField.draw();
}

var gOldTime = Date.now();
var gNewTime = null;
var gGameTime = Date.now();

var gStarField = new StarField();

//executed 60/second
var mainloop = function() {
    gNewtime = Date.now();
    dt = (gNewtime - gOldTime)/1000;
    gOldTime = gNewtime;
        
    updateGame(dt);
    drawGame();
};

var ONE_FRAME_TIME = 1000 / 60; // 60 per second
setInterval( mainloop, ONE_FRAME_TIME );
