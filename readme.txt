Aim is to create an aiming game utilising the mouse 

Objects to include in side 
1) Player -done (possible to make position dynamic)
2) Fire mechanism -done (tweak speed and size of projectile)
3) Enemy Creation -done (possible to make different colors)
4) Hitbox 
5) Scoreboard
6) end game


Project documentation 

09/10/2020:
Reading how to create random events from happening such as circles. Created a template for general illustration push to GitHub general box idea of the template. Starting out with grid layout files found out isn't able to fulfil criteria of round circles appearing around. Gave up

10/10/2020:
Found out about p5js and <canvas> decided to experiment with it, found out it is able to manipulate pixels with plenty of references and documentation and its ability to draw graphics on a webpage and manipulate it researched more into it.    

Decided to create a player, so people can feel a objective

Sources used: 
https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
https://www.w3schools.com/tags/ref_canvas.asp
https://www.w3schools.com/js/js_object_constructors.asp
https://newfivefour.com/javascript-canvas-move-a-player.html

11/10/2020:
Created a projectile like asteroid game, learned how to manipulate projectile speed, positioning and animating. 
Total time spend to create projectile 5hr. have to define a class for each element to create and set it within the canvas body I guess.
Animate function solved the issue of not animating by placing, projectile was not defined within scope of function. Take note of scope of function.
Further experiment with animate to see how it goes 

Sources used:
https://www.w3schools.com/howto/howto_js_animate.asp
https://www.w3schools.com/js/js_htmldom_animate.asp
https://animejs.com
https://javascript.info/js-animation

Figuring out how to work projectile angles using maths COS TAN SIN reading up on it first 
Figure out how to clear the animation and what to do when it stretches outside of the screen.

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2
https://www.w3schools.com/jsref/jsref_atan2.asp

Created randomised enemy across screen fixed sizing of enemy with Math.random(Mx value - minimum) + minimum

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
https://alligator.io/js/push-pop-shift-unshift-array-methods/
https://www.javascripttutorial.net/javascript-stack/
https://stackoverflow.com/questions/41654700/setting-random-size-color-and-position-to-a-shape

12/10/2020
Must create hitbox, parameters for getting hit, making the object disappear use array splice method to remove object.

Successfully created hitbox and removing objects from screen enemies.splice(enemyIndex,1)

Maybe change certain words for functions to remove confusion. 

Created criteria for ending game by pausing animation, cancelAnimationFrame 

Problem with lag too much pixel generated console log shows pixels generated outside of screen 

13/10/2020
Finalised player and enemy models added scoring system
Need to add a game start/restart UI 

14/10/2020
Added animations library , start stop end restart rule box 
Optional: make arrow keys and add sound 



