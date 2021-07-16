require "dynamic_entity"

Door = DynamicEntity:extend();

function Door:new(x, y, width, height, image, world, name,
  openanimationcolumn, openanimationrow, closeanimationcolumn, closeanimationrow)
  Door.super.new(self, x, y, width, height, image, world, name)
  self.x = x;
  self.y = y;
  self.opening = false;
  self.image = image;
  self.isGripping = false;
  self.grippedEntity = nil;
  self.tempDistance = ""

  local g = anim8.newGrid(16, 16, image:getWidth(), image:getHeight())
  self.open = anim8.newAnimation(g(openanimationcolumn,openanimationrow), 0.1, 'pauseAtEnd')
  self.close = anim8.newAnimation(g(closeanimationcolumn,closeanimationrow), 0.1, 'pauseAtEnd')
end

function Door:update(dt)
end

function Door:draw()
  if self.closing then
    self.close:draw(self.image, self.x, self.y)
  else
    self.open:draw(self.image, self.x, self.y)
  end
end

function Door:playOpen(dt)
  self.closing = false
  self.open:update(dt)
end

function Door:playClose(dt)
  self.closing = true
  self.close:update(dt)
end
