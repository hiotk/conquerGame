require "dynamic_entity"

Entrance = DynamicEntity:extend();

function Entrance:new(x, y, width, height, image, world, name, animationcolumn, animationrow)
  Entrance.super.new(self, x, y, width, height, image, world, name)
  print(x)
  self.x = x;
  self.y = y;
  self.opening = false;
  self.isGripping = false;
  self.grippedEntity = nil;
  self.tempDistance = ""
  local g = anim8.newGrid(width, height, image:getWidth(), image:getHeight())
  self.play = anim8.newAnimation(g(animationcolumn,animationrow), 0.1, 'pauseAtEnd')
end

function Entrance:update(dt)
end

function Entrance:draw()
  self.play:draw(self.image, 60, self.y)
end
