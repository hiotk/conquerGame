import Unit from "../../core/store/unit";

export default class PlayerUnit extends Unit {
  constructor() {
		super('player');
		this.init();
	}
	init() {
    // 初始化数据
    this.state = {
      direction: 'w', // 玩家当前朝向
      position: {
				x: 0, y: 0
			}, // 玩家位置
			path: [{
				x: 0,
				y: 0,
				z: 0.01,
        d: 'w'
			}], // 玩家行驶路径
			score: 0,
      highestScore: this.state.highestScore || 0,
			playing: true
    }
  }

  // 计算位置到玩家的距离
	distance(position) {
		return Math.sqrt(Math.pow(this.state.position.x - position.x, 2) + Math.pow(this.state.position.y - position.y, 2))
	}
	// 判断位置是否在行驶路径上
	outPath(position, distance = 0) {
		if(this.state.path.length <= 1) return true;
		return this.state.path.filter(function(point) {
			var dx = Math.abs(point.x - position.x);
			var dy = Math.abs(point.y - position.y);
			return (dx <= distance && dy <= distance)
		}).length === 0;
	}
	updatePosition(position) {
		this.state.position = position;
	}
	updateDirection(direction) {
		this.state.direction = direction;
	}
	updatePath(path) {
		this.state.path = path;
	}
  updateHighestScore(score) {
    this.state.highestScore = score;
  }
	gameOver() {
		this.state.playing = false;
	}

	addScore(score) {
		this.state.score += score;
	}

	unitAction({ type, payload }) {
			console.log(type, payload);
	}
}
