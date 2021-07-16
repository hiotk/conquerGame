Game = Object:extend();
function split(str, pat)
   local t = {}  -- NOTE: use {n = 0} in Lua-5.0
   local fpat = "(.-)" .. pat
   local last_end = 1
   local s, e, cap = str:find(fpat, 1)
   while s do
      if s ~= 1 or cap ~= "" then
         table.insert(t,cap)
      end
      last_end = e+1
      s, e, cap = str:find(fpat, last_end)
   end
   if last_end <= #str then
      cap = str:sub(last_end)
      table.insert(t, cap)
   end
   return t
end
local GRAVITY = 0;

function Game:new()
  self.scene = "assets/map/home.lua";
  self.entities = {}
  self.debug = {}
  self.below = {}
  self.above = {}
  self.player = {};
  self.freeze = false;
  self:loadAssets();
  self:loadLevel();
end

function Game:loadAssets()
  self.charImage = love.graphics.newImage('assets/sprites/hero.png')
  self.npcImage = love.graphics.newImage('assets/sprites/npc.png')
  self.tileImage = love.graphics.newImage('assets/map/tileset1.png')
end

function Game:setupPhysics()
  self.world = bump.newWorld(16)
  self.world.gravity = GRAVITY
end

function Game:loadLevel(x, y)
  self.entities = {}
  self:setupPhysics();
  self.map = sti(self.scene, { "bump" })
  self.map:bump_init(self.world)

  for k, object in pairs(self.map.objects) do
    if object.name == "player_spawn" then
      if x ~= nil then
        object.x = x
      end
      if y ~= nil then
        object.y = y
      end
      self.player = Player(object.x, object.y, 16, 16, self.charImage, self.world, 100, 8, 16)
      self.player.direction = object.properties.direction
      table.insert(self.entities, self.player)
      camera = Camera(self.player.x, self.player.y)
      self.below = split(object.properties.below, ",")
      self.above = split(object.properties.above, ",")
    elseif object.name == 'npc' then
      self['npc'..object.properties.name] = NPC(object.x, object.y, object.properties.name, self.npcImage, self.world, 30, 'npc'..object.properties.name)
      self['npc'..object.properties.name].direction = object.properties.direction
      table.insert(self.entities, self['npc'..object.properties.name])
    elseif string.match(object.name, "door%d*") ~= nil  then
      self[object.name] = Door(object.x, object.y, 16, 16, self.tileImage, self.world, object.name, '1-4', 17, '4-1', 17)
      self[object.name].nextScene = object.properties.to
      table.insert(self.entities, self[object.name])
    elseif string.match(object.name, "entrance%d*") ~= nil then
      self[object.name] = Entrance(object.x, object.y, object.width, object.height, self.tileImage, self.world, object.name, '1-1', 23)
      self[object.name].nextScene = object.properties.to
      self[object.name].playerX = object.properties.x
      self[object.name].playerY = object.properties.y
      table.insert(self.entities, self[object.name])
    end
  end

  self.map:removeLayer("players")
end

function Game:checkCols(entity, cols)
  local thisName = entity.name;
  for i,v in ipairs (cols) do
    local otherName = cols[i].other.name;
    if otherName ~= nil then
      if thisName == "ent_player" and string.match(otherName, "door%d*") ~= nil then
        self.player.isfreeze = true
        Timer.during(0.4, function(dt)
          self[otherName]:playOpen(dt)
          self.player:idle(dt)
        end, function()
          local y = self.player.y - 14
          Timer.tween(0.1, self.player, {y = y}, 'linear', function()
            Timer.during(0.4, function(dt)
              self.player:playHide(dt)
              self[otherName]:playClose(dt)
            end, function()
              self.player.isfreeze = nil
              self.scene = cols[i].other.nextScene
              self:loadLevel();
            end)
          end)
        end)
      elseif thisName == "ent_player" and string.match(otherName, "npc%w*") ~= nil then
        self[otherName]:doAction(self.player)
      elseif thisName == "ent_player" and string.match(otherName, "entrance%d*") ~= nil then
        self.scene = cols[i].other.nextScene
        self:loadLevel(cols[i].other.playerX, cols[i].other.playerY);
      end
    end
  end
end

function Game:update(dt)
  self.map:update(dt)
  Timer.update(dt)
  if not self.player.isfreeze then
    self:manageKeyboard(dt);
  end
  for i=1,#self.entities do
    if self.entities[i] and self.entities[i]:is(DynamicEntity) then
      self.entities[i]:updatePhysics(dt)
      self.entities[i]:update(dt)
    end
  end
  if not self.player.isfreeze then
    self.player.x, self.player.y, cols = self.world:move( self.player, self.player.x, self.player.y )
    self:checkCols(self.player, cols)
  end
  local dx,dy = self.player.x - camera.x, self.player.y - camera.y
  gooi.update(dt)
  camera:move(dx/2, dy/2)
end

function Game:manageKeyboard(dt)
  if love.keyboard.isDown( "d" ) then
    self.player:moveRight(dt)
  elseif love.keyboard.isDown("a") then
    self.player:moveLeft(dt);
  elseif love.keyboard.isDown("w") then
    self.player:moveUp(dt)
  elseif love.keyboard.isDown("s") then
    self.player:moveDown(dt)
  else
    self.player:idle(dt)
  end
end

function Game:draw()
  camera:attach()

  love.graphics.setColor( 255,255,255,255 )
  for i,v in ipairs (self.below) do
    self.map:drawTileLayer(v)
  end
  for i=1,#self.entities do
    self.entities[i]:draw()
  end
  love.graphics.setColor( 255, 93, 0,255 )
  for i=1,#self.entities do
    if self.entities[i] then
      love.graphics.rectangle("line",self.entities[i].x,self.entities[i].y,self.entities[i].w,self.entities[i].h)
    end
  end
  if self.entrance1 ~= nil then
    love.graphics.rectangle("line",self.entrance1.x,self.entrance1.y,self.entrance1.w,self.entrance1.h)
  end
  for i,v in ipairs (self.above) do
    self.map:drawTileLayer(v)
  end

  self.map:bump_draw(self.world)
  love.graphics.setColor(255, 0, 0, 255)
  love.graphics.print(self.player.yVel, 0, 48)
  love.graphics.print(self.player.xVel, 0, 60)
  love.graphics.print(self.player.x,0,12)
  love.graphics.print(self.player.y,0,24)
  love.graphics.print(self.player.direction, 0, 36)
  debug = " "
  gooi.draw()
  camera:detach()
end
