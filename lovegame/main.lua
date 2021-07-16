sti = require 'lib/sti'
anim8 = require 'lib/anim8/anim8'
bump = require "lib/bump/bump"
Object = require "lib/classic"
Camera = require "lib/hump/camera"
Timer = require "lib/hump/timer"
tween = require "lib/tween/tween"
require "lib/gooi/gooi"
require "player"
require "door"
require "npc"
require "game"
require "entrance"
local cols,GRAVITY,map,world
local entities = {}

local game;

function love.load()
  love.graphics.setBackgroundColor(0, 0, 0)
  gr = love.graphics
  kb = love.keyboard
  mo = love.mouse

  function width() return gr.getWidth() end
  function height() return gr.getHeight() end
  fontDir = "assets/fonts/"
  love.window.setMode(480, 320)
  style = {
    font = gr.newFont('assets/fonts/FZXIANGSU12.ttf',12)
  }
  gooi.setStyle(style)

  game = Game()
end

function love.update(dt)
  game:update(dt)
end


function love.draw()
  game:draw(dt);
end

function love.mousepressed( x,y,button )
  --game:loadLevel();
end

function love.resize(w, h)
  --map:resize(w, h)
end
