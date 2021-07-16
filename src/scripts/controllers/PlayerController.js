import player from '../models/player'
import CONST from '../consts/index'
import Hero from '../models/Hero';
import GridPlane from '../utils/GridPlane';
import Controller from '../../core/controllers/Controller';
import _ from 'lodash'
// 计算玩家位置、方向、区域等
export default class PlayerController extends Controller {
    constructor() {
		super()
		/** 存储上一次的位置 */
		this.position = {x:0,y:0}
		/** 存储上一次的方向 */
		this.direction = 'w'
	}

	Start() {
		this.clock.start();
	}

	Update() {
		super.Update()
		this.updateData();
		this.updateModel();
	}

	updateData() {
		// 1. 根据玩家位置，计算是否新生成路径或者格子
		this.calculate();
		// 2. 更新玩家位置
		const delta = this.clock.getDelta()
		const playerUnit = this.store.getUnit('player');
		var dir = CONST.direction[this.direction];

		const groundUnit = this.store.getUnit('ground');
		console.log(dir)
		if(groundUnit.isPosValid(playerUnit.state.position.x + dir.x* CONST.playerV*delta, playerUnit.state.position.y + dir.y* CONST.playerV*delta)){
			console.log('valid')
			playerUnit.state.position.x += dir.x* CONST.playerV*delta;
			playerUnit.state.position.y += dir.y* CONST.playerV*delta;
		}else{
			this.direction = playerUnit.state.direction;
		}
		playerUnit.updatePosition(playerUnit.state.position)
	}

	updateModel() {
		// 获取数据、界面引用对象，开始更新数据
		const groundUnit = this.store.getUnit('ground');
		const playerUnit = this.store.getUnit('player');
		const { blocks=[] } = groundUnit.state;
		const { path, position } = playerUnit.state;

		const heroModel = this.parent.hero;
		const pathModel = this.parent.heroPath;
		const camera = this.parent.camera;
		const shaderModel = this.parent.heroShader;

		// 添加区块更新界面
		const gridPlane = this.parent.ground;
		gridPlane.updateFaceIndex(blocks.map(block=> block.point1));
		// 方向继承上次的方向
		heroModel.updateDirection(this.direction);
		// 位置需要实时更新
		heroModel.updatePosition(position);
		shaderModel.updatePosition(position);
		pathModel.updatePath(path);

		// 更新相机位置
		camera.position.x = position.x-15;
		camera.position.y = position.y-15;
		camera.position.z = 15*Math.sqrt(3)/2;
		camera.up = new THREE.Vector3(0.5, 0.5, 0)
		camera.lookAt( position.x, position.y, 0 );
	}

	// 位置相关计算
	calculate() {
		const groundUnit = this.store.getUnit('ground');
		const playerUnit = this.store.getUnit('player');
		const enemyUnit = this.store.getUnit('enemy');

		// 计算是否有一格的距离
		var distance = Math.sqrt(Math.pow(playerUnit.state.position.x - this.position.x, 2) + Math.pow(playerUnit.state.position.y - this.position.y, 2))
		// 如果距离大于1,进行相关逻辑计算
		var sameDir = playerUnit.state.direction === this.direction;
		if(distance>=1) {
			// 用户运动方向判断

			// 更新用户位置
			playerUnit.state.position = { x: Math.round(playerUnit.state.position.x), y: Math.round(playerUnit.state.position.y) }

			// 如果当前用户方向与之前方向不一致,则变向
			if(!sameDir)
				this.direction = playerUnit.state.direction;
			// 记录上次坐标位置
			this.position = { x: playerUnit.state.position.x, y: playerUnit.state.position.y };

			// 在行驶路径中查找是否有该点
			var findIndex = playerUnit.state.path.findIndex(function(item) {
				return item.x === playerUnit.state.position.x && item.y === playerUnit.state.position.y;
			})
			var cleared = groundUnit.value(playerUnit.state.position.x, playerUnit.state.position.y)
			console.log(cleared)
			if(cleared){
				playerUnit.state.path.push({
					x: playerUnit.state.position.x,
					y: playerUnit.state.position.y,
					z: 0.01,
					d: playerUnit.state.direction
				})
				const blocks = groundUnit.addArea2(playerUnit.state.path)
				enemyUnit.state.enemies.forEach(enemy=>{
					const x = Math.floor(enemy.position.x);
					const y = Math.floor(enemy.position.y);
					const index = blocks.findIndex(block=> block.point1.x <= x && block.point1.y <= y &&
						block.point1.x + 1 >= x && block.point1.y + 1 >= y);
					if(index !== -1) {
						enemy.isKilled = true;
						// 加分
						console.log(enemy)
						playerUnit.addScore(enemy.score)
					}
				})
				playerUnit.addScore(CONST.blocksScores(blocks.length));

				playerUnit.updatePath([{
          x: playerUnit.state.position.x,
          y: playerUnit.state.position.y,
          z: 0.01,
          d: playerUnit.state.direction
       	}]);

			}else	if(findIndex!==-1) {
				playerUnit.state.path.push({
					x: playerUnit.state.position.x,
					y: playerUnit.state.position.y,
					z: 0.01,
					d: playerUnit.state.direction
				})
				var directions = playerUnit.state.path.map((e)=>{
					return e.d
				})
				directions = _.uniq(directions)
				console.log(directions)
				if(directions.length >= 4){
					const blocks = groundUnit.addArea2(playerUnit.state.path)
					enemyUnit.state.enemies.forEach(enemy=>{
						const x = Math.floor(enemy.position.x);
						const y = Math.floor(enemy.position.y);
						const index = blocks.findIndex(block=> block.point1.x <= x && block.point1.y <= y &&
							block.point1.x + 1 >= x && block.point1.y + 1 >= y);
						if(index !== -1) {
							enemy.isKilled = true;
							// 加分
							console.log(enemy)
							playerUnit.addScore(enemy.score)
						}
					})
					playerUnit.addScore(CONST.blocksScores(blocks.length));

					if(!blocks.length){
						playerUnit.state.path.splice(findIndex, playerUnit.state.path.length - findIndex);
						playerUnit.updatePath(playerUnit.state.path);
					}else{
						playerUnit.updatePath([{
		          x: playerUnit.state.position.x,
		          y: playerUnit.state.position.y,
		          z: 0.01,
		          d: playerUnit.state.direction
		       	}]);
					}
				}else{
					const verticals = {
						'w': ['a', 'd'],
						'a': ['w', 's'],
						's': ['a', 'd'],
						'd': ['w', 's']
					}
					const contras = {
						'w': 's',
						's': 'w',
						'a': 'd',
						'd': 'a'
					}
					if(playerUnit.state.path.length > 2){
						var dircs = verticals[playerUnit.state.direction]
						var last = playerUnit.state.path[playerUnit.state.path.length-1]
						var beforelast = playerUnit.state.path[playerUnit.state.path.length-3]
						console.log(beforelast.d)
						console.log(dircs)
						if(dircs.indexOf(beforelast.d) == -1){
							playerUnit.state.path.splice(findIndex, playerUnit.state.path.length - findIndex);
							playerUnit.updatePath(playerUnit.state.path);
						}
					}else{
						playerUnit.updatePath([{
		          x: playerUnit.state.position.x,
		          y: playerUnit.state.position.y,
		          z: 0.01,
		          d: playerUnit.state.direction
		       	}]);
					}
				}
			} else {
				// 如果未查找到
				playerUnit.state.path.push({
					x: playerUnit.state.position.x,
					y: playerUnit.state.position.y,
					z: 0.01,
					d: playerUnit.state.direction
				})
				playerUnit.updatePath(playerUnit.state.path);
			}
		}
	}

	/**
	 * 游戏逻辑检测 - 碰撞检测等
	 */
	detection() {
		// 1. 超出游戏界限

		// 2. 其它...

		return false;
	}
}
