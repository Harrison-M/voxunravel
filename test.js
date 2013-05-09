var textures = "http://commondatastorage.googleapis.com/voxeltextures/"
var voxel = require('voxel')

var sortGenerate = function(generator){
  return function(x,y,z){
    if(z === 0)
    {
      //Turn our x into an x-z coordinate on the "spiral"
      
      //Origin remains same
      if(x === 0) return generator(x,y,z)
      else if(x > 0) {
        //What square are we in
        var ring = Math.ceil(Math.log(x + 1)/Math.log(2))
        //Goes up in increments of 2 starting w/ 1
        if(ring % 2 === 0) ring++
        
        //How far in are we?
        var borderprogress = x - Math.pow(ring - 2, 2)
        
        //Count around square until we get to our voxel
        var newx = (ring-1)/2
        var newz = 0
        for(var i = 1; i < x; i++)
        {
          //Turns
          //Start going left on the right bottom
          if(newx === (ring-1)/2 && newz === (ring-1)/-2)
            newx--
          //Start going up from the left bottom
          else if(newx === (ring-1)/-2 && newz === (ring-1)/-2)
            newz++
          //Start going right from the top left
          else if(newx === (ring-1)/-2 && newz === (ring-1)/2)
            newx++
          //Start going down from the top right
          else if(newx === (ring-1)/2 && newz === (ring-1)/2)
            newz--
          //Else progress based on side
          //Right
          else if(newx === (ring-1)/2)
            newz--
          //Bottom
          else if(newz === (ring-1)/-2)
            newx--
          //Left
          else if(newx === (ring-1)/-2)
            newz++
          //Top
          else if(newz === (ring-1)/2)
            newx++
        }

        //Use transform to retrieve voxel value
        return generator(newx,y,newz);
      }
    }
  }
}
window.generate = sortGenerate(function(x,y,z){
    if(y !== 1) return 0
    if((x+z) % 2 === 0) return 2
    return 1
})
require('voxel-hello-world')({
  generate: window.generate,
  texturePath: textures,
  playerSkin: textures + 'player.png'
}, setup)

function setup(game, avatar) {
  avatar.yaw.position.set(5,2,5)

  var fly = require('./')
  var makeFly = fly(game)
  var flight = makeFly(avatar)
  window.game = game
  window.flight = flight

  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 'F'.charCodeAt(0)) {
      !flight.flying ? flight.startFlying(false) : flight.stopFlying()
    }
  });
  flight.startFlying(false);
}
