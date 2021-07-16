require "dynamic_entity"

Player = DynamicEntity:extend();

function Player:new(x, y, width, height, image, world, speed, offsetX, offsetY)
  Player.super.new(self, x, y, width, height, image, world, "ent_player")
  self.origX = x;
  self.width = width;
  self.height = height;
  self.origY = y;
  self.offsetX = offsetX;
  self.offsetY = offsetY;
  self.speed = speed
  self.image = image;
  self.isGripping = false;
  self.grippedEntity = nil;
  self.tempDistance = ""

  local g = anim8.newGrid(32, 32, image:getWidth(), image:getHeight())
  self.movedown = anim8.newAnimation(g('1-4',1), 0.1)
  self.moveup = anim8.newAnimation(g('1-4',2), 0.1)
  self.moveright = anim8.newAnimation(g('1-4',3), 0.1):flipH()
  self.moveleft = anim8.newAnimation(g('1-4',3), 0.1)
  self.hide = anim8.newAnimation(g('6-6', 4), 0.1)
end

function Player:update(dt)
end

function Player:idle(dt)
  self.xVel = 0
  self.yVel = 0
  if self.direction == 1 then
    self.movedown:gotoFrame(4)
  elseif self.direction == 2 then
    self.moveup:gotoFrame(4)
  elseif self.direction == 3 then
    self.moveleft:gotoFrame(4)
  elseif self.direction == 4 then
    self.moveright:gotoFrame(4)
  end
end

function Player:draw()
  if self.direction == 1 then
    self.movedown:draw(self.image, self.x-self.offsetX, self.y-self.offsetY)
  elseif self.direction == 2 then
    self.moveup:draw(self.image, self.x-self.offsetX, self.y-self.offsetY)
  elseif self.direction == 3 then
    self.moveleft:draw(self.image, self.x-self.offsetX, self.y-self.offsetY)
  elseif self.direction == 4 then
    self.moveright:draw(self.image, self.x-self.offsetX, self.y-self.offsetY)
  elseif self.direction == 5 then
    self.hide:draw(self.image, self.x-self.offsetX, self.y-self.offsetY)
  end
end

function Player:checkCols(cols)
  Player.super:checkCols(cols)
  self.grounded = false
  for i,v in ipairs (cols) do
    local otherName = cols[i].other.name

    if cols[i].normal.y == -1 then
      self.yVel = 0
      self.grounded = true
    elseif cols[i].normal.y == 1 then
      self.yVel = -self.yVel/4
    end
    if cols[i].normal.x ~= 0 and cols[i].other.xVel == nil then
      self.xVel = 0
    end
  end
end

function Player:moveRight(dt)
  self.xVel = self.speed
  self.yVel = 0
  self.direction = 4
  self.moveright:update(dt)
end

function Player:moveLeft(dt)
  self.yVel = 0
  self.xVel = -self.speed
  self.direction = 3
  self.moveleft:update(dt)
end

function Player:moveUp(dt)
  self.xVel = 0
  self.yVel = -self.speed
  self.direction = 2
  self.moveup:update(dt)
end

function Player:moveDown(dt)
  self.xVel = 0
  self.yVel = self.speed
  self.direction = 1
  self.movedown:update(dt)
end

function Player:playHide(dt)
  self.yVel = 0
  self.xVel = 0
  self.direction = 5
  self.hide:update(dt)
end

