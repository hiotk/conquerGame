require "dynamic_entity"
npcs = require "data/npc"
variables = require "data/variables"
NPC = DynamicEntity:extend();
function NPC:new(x, y, name, image, world, speed, npcname)
  self.npc = npcs[name]
  NPC.super.new(self, x, y, self.npc.width, self.npc.height, image, world, npcname)
  self.x = x;
  self.y = y;
  self.width = self.npc.width;
  self.height = self.npc.height;
  self.offsetX = self.npc.offsetX;
  self.offsetY = self.npc.offsetY;
  self.speed = speed;
  self.image = image;
  self.talking = false;
  local g = anim8.newGrid(self.npc.gridWidth, self.npc.gridHeight, image:getWidth(), image:getHeight())

  self.movedown = anim8.newAnimation(g(self.npc.movedown.column,self.npc.movedown.row), 0.1)
  self.moveup = anim8.newAnimation(g(self.npc.moveup.column,self.npc.moveup.row), 0.1)
  self.moveright = anim8.newAnimation(g(self.npc.moveleft.column,self.npc.moveleft.row), 0.1):flipH()
  self.moveleft = anim8.newAnimation(g(self.npc.moveleft.column,self.npc.moveleft.row), 0.1)
  self.hide = anim8.newAnimation(g('42-42', 2), 0.1)
end

function NPC:update(dt)
end

function NPC:idle(dt)
  self.xVel = 0
  self.yVel = 0
  if self.direction == 1 then
    self.movedown:gotoFrame(1)
  elseif self.direction == 2 then
    self.moveup:gotoFrame(1)
  elseif self.direction == 3 then
    self.moveleft:gotoFrame(1)
  elseif self.direction == 4 then
    self.moveright:gotoFrame(1)
  end
end

function NPC:face(player)
  local mx = self.x - player.x
  local my = self.y - player.y

  if math.abs(mx) > math.abs(my) then
    if mx > 0 then
      self.direction = 3
    else
      self.direction = 4
    end
  elseif math.abs(mx) <= math.abs(my) then
    if my > 0 then
      self.direction = 2
    else
      self.direction = 1
    end
  end
end

function NPC:doAction(player)
  for k, v in pairs(self.npc.action) do
    local todo = true
    if v.globalcondition then
      for s, t in pairs(v.globalcondition) do
        if t ~= variables[s] then
          todo = false
        end
      end
    end
    if v.selfcondition then
      for s, t in pairs(v.selfcondition) do
        if t ~= self.npc[s] then
          todo = false
        end
      end
    end
    if todo then
      player.isfreeze = v.freeze
      if v.action == 'talk' then
        self:talk(v.content)
        self:face(player)
      end
      if v.command == 'heal' then
        print('heal')
      end
    end
  end
end

function NPC:talk(content)
  if not self.talking then
    self.talking = true
    self.dialog = gooi.newLabel({
        x = self.x - 64, y = self.y - 52,
        w = 138, h = 48, text = content,
        icon = 'assets/ui/textbtn.png'
    })
      :setOpaque(true)
      :left()
      :setBGImage('assets/ui/talk.png')
      :fg({0, 0, 0})
      :bg({0,0,0,0})
  end
end

function NPC:draw()
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

function NPC:checkCols(cols)
  NPC.super:checkCols(cols)
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

function NPC:moveRight(dt)
  self.xVel = self.speed
  self.yVel = 0
  self.direction = 4
  self.moveright:update(dt)
end

function NPC:moveLeft(dt)
  self.yVel = 0
  self.xVel = -self.speed
  self.direction = 3
  self.moveleft:update(dt)
end

function NPC:moveUp(dt)
  self.xVel = 0
  self.yVel = -self.speed
  self.direction = 2
  self.moveup:update(dt)
end

function NPC:moveDown(dt)
  self.xVel = 0
  self.yVel = self.speed
  self.direction = 1
  self.movedown:update(dt)
end

function NPC:playHide(dt)
  self.yVel = 0
  self.xVel = 0
  self.direction = 5
  self.hide:update(dt)
end

