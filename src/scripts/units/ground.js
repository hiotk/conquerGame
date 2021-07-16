import Unit from "../../core/store/unit";
import consts from '../consts';
import _ from 'lodash'
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

export default class GroundUnit extends Unit {
  constructor() {
      super('ground');
      this.init();
  }
  init() {
      // 初始化数据
      this.state = {
          blocks: [], // 所有块
          points: [], // 所有点
          paths: [],
          cells: [], // 所有块
          tmpCells: [],
          areas: [], // 所有区域
      }
      var n = consts.gridCount * consts.gridCount;
      var t = Math.floor(consts.gridCount/2);
      for(var i = 0; i < n; i++){
        var pos = this.pos(i), x = pos.x, y = pos.y;
        this.state.points.push(x >= (2-t) && x < (t-2) && y >= (3-t) && y < (t-1) ? 0 : consts.CA_CLEAR )
      }

      var m = (consts.gridCount - 1) * (consts.gridCount - 1);
      for(var i = 0; i < m; i++){
        var pos = this.cellPos(i), x = pos.x, y = pos.y;
        this.state.cells.push(x >= 1-t && x < (t-2) && y > 2-t && y <= (t-1) ? 0 : consts.CA_CLEAR )
      }
      var blocks = []
      for(var i = 0; i< m; i++){
        if(this.state.cells[i]){
          var pos = this.cellPos(i)
          var block = this.cellToBlock(pos.x, pos.y)
          blocks.push(block)
        }
      }
      this.addBlocks(blocks)
  }

  cellPos(i) {
    return {
      x: (i % (consts.gridCount - 1) - consts.gridCount/2),
      y: -Math.floor(i/(consts.gridCount - 1)) + consts.gridCount/2
    }
  }
  cellValue(x, y) {
    var i = this.cellIndex(x, y)
    return i >=0 ? this.state.cells[i] : 0;
  }

  isCellValid(x, y) {
    var t = Math.floor(consts.gridCount/2);
    return x >= -t && x <= (t-2) && y >= 2-t && y <= t;
  }
  cellIndex(x, y) {
    return this.isCellValid(x, y) ? (consts.gridCount - 1) * (consts.gridCount/2 - y) + x + consts.gridCount/2 : -1
  }
  cellToBlock(x, y){
    var block = {
      point1: {x: x, y: y },
      point2: {x: x+1, y: y },
      point3: {x: x+1, y: y-1 },
      point4: {x: x, y: y-1 },
      mesh: null
    }
    return block;
  }
  posToCells(x, y, d){
    var directions = {
      w: ['a', 'd'],
      s: ['a', 'd'],
      a: ['w', 's'],
      d: ['w', 's']
    }
    var cells = []
    if(d == 'w'){
      if(this.isCellValid(x-1, y+1)){
        cells.push({
          x: x-1, y: y+1
        })
      }
      if(this.isCellValid(x, y+1)){
        cells.push({
          x: x, y: y+1
        })
      }
    }else if(d == 'd'){
      if(this.isCellValid(x, y)){
        cells.push({
          x: x, y: y
        })
      }
      if(this.isCellValid(x, y + 1)){
        cells.push({
          x: x, y: y + 1
        })
      }
    }else if(d == 's'){
      if(this.isCellValid(x, y)){
        cells.push({
          x: x, y: y
        })
      }
      if(this.isCellValid(x-1, y)){
        cells.push({
          x: x-1, y: y
        })
      }
    }else if(d == 'a'){
      if(this.isCellValid(x - 1, y + 1)){
        cells.push({
          x: x - 1, y: y + 1
        })
      }
      if(this.isCellValid(x - 1, y)){
        cells.push({
          x: x - 1, y: y
        })
      }
    }
    return cells
  }
  pos(i) {
    return {
      x: (i % consts.gridCount - consts.gridCount/2),
      y: -Math.floor(i/consts.gridCount) + consts.gridCount/2
    }
  }
  isPosValid(x, y) {
    var t = Math.floor(consts.gridCount/2);
    return x >= -t && x <= (t-1) && y >= 1-t && y <= t;
  }
  pointIndex(x, y) {
    return this.isPosValid(x, y) ? consts.gridCount * (consts.gridCount/2 - y) + x + consts.gridCount/2 : -1
  }
  value(x, y) {
    var i = this.pointIndex(x, y)
    return i >= 0? this.state.points[i] : 0;
  }
  // 添加区块
	addBlocks(blocks) {
		this.state.blocks.forEach(function(oldBlock) {
			var index = blocks.findIndex(function(newBlock) { return newBlock.point1.x === oldBlock.point1.x && newBlock.point1.y === oldBlock.point1.y });
			if(index!==-1) blocks.splice(index, 1);
		})
		this.state.blocks = this.state.blocks.concat(blocks);
  }
  findDirs(x, y){
    var dirs = []
    var block
    if(this.isCellValid(x-1, y) && !this.cellValue(x-1, y)){
      block = this.cellToBlock(x-1, y)
      if(this.state.paths.indexOf(this.pointIndex(block.point2.x, block.point2.y)) == -1 ||
        this.state.paths.indexOf(this.pointIndex(block.point3.x, block.point3.y)) == -1){
        dirs.push('a')
      }
    }
    if(this.isCellValid(x, y-1) && !this.cellValue(x, y-1)){
      block = this.cellToBlock(x, y-1)
      if(this.state.paths.indexOf(this.pointIndex(block.point2.x, block.point2.y)) == -1 ||
        this.state.paths.indexOf(this.pointIndex(block.point1.x, block.point1.y)) == -1){
        dirs.push('s')
      }
    }

    if(this.isCellValid(x+1, y) && !this.cellValue(x+1, y)){
      block = this.cellToBlock(x+1, y)
      if(this.state.paths.indexOf(this.pointIndex(block.point1.x, block.point1.y)) == -1 ||
        this.state.paths.indexOf(this.pointIndex(block.point4.x, block.point4.y)) == -1){
        dirs.push('d')
      }
    }
    if(this.isCellValid(x, y+1) && !this.cellValue(x, y+1)){
      block = this.cellToBlock(x, y+1)
      if(this.state.paths.indexOf(this.pointIndex(block.point4.x, block.point4.y)) == -1 ||
        this.state.paths.indexOf(this.pointIndex(block.point3.x, block.point3.y)) == -1){
        dirs.push('w')
      }
    }
    return dirs
  }
  floodFill(x, y, i){
    var tmpCells = i;
    var usedCells = [];
    var lim = 6 * consts.gridCount * consts.gridCount
    var n=0;
    usedCells.push({x, y})
    do{
      var cell = usedCells.shift()
      if(cell){
        x = cell.x
        y = cell.y
        if(tmpCells.indexOf(this.cellIndex(x, y)) == -1){
          tmpCells.push(this.cellIndex(x, y))
        }
        var block
        if(this.isCellValid(x-1, y)){
          block = this.cellToBlock(x-1, y)
          if(this.cellValue(x-1, y) == 0){
            if(this.state.paths.indexOf(this.pointIndex(block.point2.x, block.point2.y)) == -1 ||
            this.state.paths.indexOf(this.pointIndex(block.point3.x, block.point3.y)) == -1){
              if(tmpCells.indexOf(this.cellIndex(x-1, y)) == -1){
                tmpCells.push(this.cellIndex(x-1, y));
                usedCells.push({
                  x: x-1,
                  y: y
                })
              }
            }
          }
        }
        if(this.isCellValid(x, y-1)){
          block = this.cellToBlock(x, y-1)
          if(this.cellValue(x, y-1) == 0){
            if(this.state.paths.indexOf(this.pointIndex(block.point1.x, block.point1.y)) == -1 ||
            this.state.paths.indexOf(this.pointIndex(block.point2.x, block.point2.y)) == -1){
              if(tmpCells.indexOf(this.cellIndex(x, y - 1)) == -1){
                tmpCells.push(this.cellIndex(x, y - 1));
                usedCells.push({
                  x: x,
                  y: y - 1
                })
              }
            }
          }
        }
        if(this.isCellValid(x+1, y)){
          block = this.cellToBlock(x+1, y)
          if(this.cellValue(x+1, y) == 0){
            if(this.state.paths.indexOf(this.pointIndex(block.point1.x, block.point1.y)) == -1 ||
            this.state.paths.indexOf(this.pointIndex(block.point4.x, block.point4.y)) == -1){
              if(tmpCells.indexOf(this.cellIndex(x + 1, y)) == -1){
                tmpCells.push(this.cellIndex(x + 1, y));
                usedCells.push({
                  x: x + 1,
                  y: y
                })
              }
            }
          }
        }
        if(this.isCellValid(x, y+1)){
          block = this.cellToBlock(x, y+1)
          if(this.cellValue(x, y+1) == 0){
            if(this.state.paths.indexOf(this.pointIndex(block.point3.x, block.point3.y)) == -1 ||
            this.state.paths.indexOf(this.pointIndex(block.point4.x, block.point4.y)) == -1){
              if(tmpCells.indexOf(this.cellIndex(x, y + 1)) == -1){
                tmpCells.push(this.cellIndex(x, y + 1));
                usedCells.push({
                  x: x,
                  y: y + 1
                })
              }
            }
          }
        }
      }
    }while(n++ < lim && usedCells.length)

    return tmpCells
  }
  updatePath(points) {
    var self = this;
    this.state.paths = points.map(function(point){
      return self.pointIndex(point.x, point.y)
    })
  }
  // 添加区域2
  addArea2(points){
    var area = {
      points,
      mesh: null
    }
    var self = this;
    this.state.paths = points.map(function(point){
      return self.pointIndex(point.x, point.y)
    })
    var blocks = []
    for (var i = 0; i < area.points.length; i++) {
      var sides = this.posToCells(area.points[i].x, area.points[i].y, area.points[i].d)
      var deltas = []
      for (var j = 0; j < sides.length; j++){
        if(this.cellValue(sides[j].x, sides[j].y) != 0){
          continue
        }
        var delta = this.floodFill(sides[j].x, sides[j].y, [])
        delta = delta.sort()
        deltas.push(delta)
      }
      var cells = []
      console.log(deltas)
      if(deltas.length >= 2) {
        console.log(deltas[0].equals(deltas[1]))
        if(deltas[0].equals(deltas[1])){
        }else if(deltas[0].length >= deltas[1].length){
          cells = deltas[1]
        }else if(deltas[0].length < deltas[1].length){
          cells = deltas[0]
        }
      }
      for(var k = 0; k < cells.length; k++){
        this.state.cells[cells[k]] = consts.CA_CLEAR
        var cellPos = this.cellPos(cells[k])
        var block = this.cellToBlock(cellPos.x, cellPos.y)
        this.state.points[this.pointIndex(block.point1.x, block.point1.y)] = consts.CA_CLEAR
        this.state.points[this.pointIndex(block.point2.x, block.point2.y)] = consts.CA_CLEAR
        this.state.points[this.pointIndex(block.point3.x, block.point3.y)] = consts.CA_CLEAR
        this.state.points[this.pointIndex(block.point4.x, block.point4.y)] = consts.CA_CLEAR
        blocks.push(block)
      }
    }
    console.log(blocks)
    if(blocks.length){
      this.addBlocks(blocks)
    }
    return blocks;
  }

  // 添加区域
	addArea(points) {
		// 加入区域
		var area = {
			points,
			mesh: null
		}
		// 计算新增区域中的所有格子数量
		// 1. 计算区域范围
		var firstPoint = area.points[0];
		var maxX = firstPoint.x, maxY = firstPoint.y, minX = firstPoint.x, minY = firstPoint.y;
		area.points.forEach(function(point) {
			if(point.x>maxX) maxX = point.x;
			if(point.y>maxY) maxY = point.y;
			if(point.x<minX) minX = point.x;
			if(point.y<minY) minY = point.y;
		})
		// 2. 计算相交数,奇数次相交则在区域内
		var blocks = [];
		var pCount = area.points.length;
		for(var x=minX;x<=maxX;x++) {
			var intCount = -1;
			for(var y=maxY;y>minY;y--) {
				var block = {
					point1: {x: x, y: y },
					point2: {x: x+1, y: y },
					point3: {x: x+1, y: y+1 },
					point4: {x: x, y: y+1 },
					mesh: null
				}
				var samePoints = area.points.filter(function(p, index) {
					var prevPoint = area.points[(pCount+index-1)%pCount];
					var nextPoint = area.points[(pCount+index+1)%pCount];
					return (block.point1.x === p.x && block.point1.y === p.y) && ((block.point2.x === prevPoint.x && block.point2.y===prevPoint.y) || (block.point2.x === nextPoint.x && block.point2.y===nextPoint.y))
				})
				if(samePoints.length===1) {
					// 表示和块中心点相交
					intCount = intCount+1;
				}
				if(intCount%2===0) {
					blocks.push(block);
				}
			}
		}
		this.addBlocks(blocks);
		this.state.areas.push(area);
		return blocks;
  }

    // 判断某一点是否可以生成怪物
	outBlock(position) {
		return this.state.blocks.filter(function(block) {
			return (block.point1.x === position.x && block.point1.y === position.y) || (block.point3.x === position.x && block.point3.y === position.y)
		}).length === 0;
	}

	unitAction({ type, payload }) {
        console.log(type, payload);
    }
}
