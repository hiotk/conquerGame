return {
  mother = {
    gridWidth = 16,
    gridHeight = 32,
    offsetX = 0,
    offsetY = 16,
    width = 16,
    height = 16,
    moveup = {
      row = 3,
      column = '17-17'
    },
    movedown = {
      row = 3,
      column = '16-16'
    },
    moveleft = {
      row = 3,
      column = '18-18'
    },
    action = {
      action1 = {
        globalcondition = {
          talking_with_doctor = false
        },
        selfcondition = {
        },
        action = 'talk',
        freeze = false,
        content = '妈妈『..对了,\n男孩就要多出去走走\n这是电视说的\n对了\n大木博士\n说要看看你',
        command = '',
        after = {
        }
      },
      action2 = {
        globalcondition = {
          talking_with_doctor = true
        },
        action = 'talk',
        content = '太累了，休息一下吧',
        freeze = true,
        command = 'heal',
        after = {
        }
      }
    }
  }
}
