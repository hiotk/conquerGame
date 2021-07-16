require "entity"


DynamicEntity = Entity:extend()

function DynamicEntity:new(x, y, width, height, image, world, ent_name)
  DynamicEntity.super.new(self, x, y, width, height, image, world, ent_name)
  self.xVel = 0;
  self.yVel = 0;
  self.direction = 1;
end

function DynamicEntity:checkCols(cols)
  for i,v in ipairs (cols) do
    if cols[i].normal.y ~= 0 then
      self.yVel = 0
    end
    if cols[i].normal.x ~= 0 then
      self.xVel = 0
    end
  end
end

function DynamicEntity:update(dt)
end

function DynamicEntity:updatePhysics(dt)
  self.x = self.x + self.xVel*dt
  self.y = self.y + self.yVel*dt
end
