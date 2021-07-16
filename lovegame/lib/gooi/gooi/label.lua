----------------------------------------------------------------------------
----------------------------------------------------------------------------
--------------------------   Label creator  --------------------------------
----------------------------------------------------------------------------
function gooi.newLabel(params)
    params = params or {}
    local l = {}
    defaultText = "new label"

    local x, y, w, h = gooi.checkBounds(
        params.text or defaultText,
        params.x or 10,
        params.y or 10,
        params.w or gooi.getFont():getWidth(params.text or defaultText),
        params.h or gooi.getFont():getHeight() * 2,
        "label"
    )

    l = component.new("label", x, y, w, h, params.group)
    l = gooi.setStyleComp(l)
    l.opaque = false
    l.offsety = 1
    l.nowpart = 1
    l.talked = false
    l.timer = 0
    l.talktimer = 0
    l.text = params.text or defaultText
    l.icon = params.icon
    if l.icon then
        if type(l.icon) == "string" then
            l.icon = love.graphics.newImage(l.icon)
        end
        if l.text:len() > 0 then
            l.w = l.w + l.icon:getWidth()
        end
    end
    l.textParts = split(l.text, "\n")
    function l:rebuild()
        --self:generateBorder()
    end
    l:rebuild()
    function l:setText(value)
        if not value then value = "" end
        self.text = tostring(value)
        self.textParts = split(self.text, "\n")
        return self
    end
    function l:largerLine()
        local line = self.textParts[1] or ""

        for i = 2, #self.textParts do
            if #self.textParts[i] > #line then
                line = self.textParts[i]
            end
        end

        return line
    end
    function l:drawSpecifics(fg)
        local t = self:largerLine() or ""
        -- Right by default:
        local x = self.x + self.w - gooi.getFont(self):getWidth(t) - self.h / 2
        local y = (self.y + self.h / 2) - (gooi.getFont(self):getHeight() / 2)
        if self.align == gooi.l then
            x = self.x + self.h / 2
            if self.icon then
                x = x + self.h / 2
            end
        elseif self.align == "center" then
            x = (self.x + self.w / 2) - (gooi.getFont(self):getWidth(t) / 2)
        end
        if self.icon and not self.talked then
            local xImg = math.floor(self.x + self.w - (gooi.getFont(self):getHeight()))
            love.graphics.setColor(1, 1, 1)
            if not self.enabled then love.graphics.setColor(1/4, 1/4, 1/4) end
            if t:len() == 0 then
                xImg = math.floor(self.x + self.w / 2)
            end
            love.graphics.draw(self.icon, xImg, math.floor(self.y + self.h - 3*(gooi.getFont(self):getHeight()/2) - self.offsety), 0, 1, 1,
                math.floor(self.icon:getWidth() / 2),
                math.floor(self.icon:getHeight() / 2))
        end
        love.graphics.setColor(fg)
        local yLine = self.y + 2*(gooi.getFont(self):getHeight()/3)
        for i = 0, 1 do
            local part = self.textParts[self.nowpart+i]
            if part ~= nil then
                local xLine = self.x + self.w - gooi.getFont(self):getWidth(part) - self.h / 2
                if self.align == gooi.l then
                    xLine = self.x + gooi.getFont(self):getHeight()
                elseif self.align == "center" then
                    xLine = (self.x + self.w / 2) - (gooi.getFont(self):getWidth(part) / 2)
                end
                love.graphics.print(part,
                    math.floor(xLine),
                    math.floor(yLine))

                yLine = yLine + (gooi.getFont(self):getHeight())
            end
        end
        --love.graphics.print(self.text, math.floor(x), math.floor(y))
    end
    function l:left()
        self.align = gooi.l
        return self
    end
    function l:center()
        self.align = "center"
        return self
    end
    function l:right()
        self.align = gooi.r
        return self
    end
    l:right()
    function l:setIcon(icon)
      if type(icon) == "string" then
          icon = love.graphics.newImage(icon)
      end
      self.icon = icon
      --self.w = self.w + self.icon:getWidth()
      return self
      -- body
    end
    function l:update(dt)
      self.timer = self.timer + dt
      self.talktimer = self.talktimer + dt
      local loops = math.floor(self.timer / 0.2)
      local part = math.floor(self.talktimer / 0.6)
      if part ~= 0 then
        if self.nowpart == (#self.textParts - 1) then
            self.talked = true
        else
            self.nowpart = self.nowpart + 1
        end 
        self.talktimer = 0
      end
      if loops ~= 0 then
        self.offsety = -self.offsety
        self.timer = 0
        if self.nowpart == (#self.textParts - 1) then
            self.talked = true
        end
      end
    end
    return gooi.storeComponent(l, id)
end
