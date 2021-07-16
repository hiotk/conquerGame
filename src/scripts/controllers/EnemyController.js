import consts from '../consts'
import Monster from '../models/Monster';
import Controller from '../../core/controllers/Controller';
import { Vector3 } from 'babylonjs';

export default class EnemyController extends Controller {
	constructor() {
		super();
		this.max = 1; // 敌人数量最多100个
		this.born = 1*1000; // 1s 诞生一个敌人
		this.timestamp = Date.now();
		this.meshes = {};
	}

	Update() {
		// 计算怪物位置
		this.updateData();
		// 绘制
		this.updateModel();
	}
	updateData() {
		const enemyUnit = this.store.getUnit('enemy');
		const groundUnit = this.store.getUnit('ground');
		const playerUnit = this.store.getUnit('player');

		// 随机计算生成敌人的位置
		if((Date.now() - this.timestamp)>= this.born && enemyUnit.state.enemies.length <= this.max) {
			this.timestamp = Date.now();
			var x = Math.round(Math.random()* consts.gridCount) % consts.gridCount - consts.gridCount/2;
			var y = Math.round(Math.random()* consts.gridCount) % consts.gridCount - consts.gridCount/2;
			var pos = { x: x, y: y };
			var distance = playerUnit.distance(pos);

			// 落到玩家的区域内、玩家行驶路线上
			if(playerUnit.outPath(pos) &&  groundUnit.outBlock(pos) && enemyUnit.outEnemy(pos) && distance>3 && distance <= 30) {
				enemyUnit.createEnemy(pos);
			}
		}

		// 计算敌人的下一目的地
		var that = this;
		enemyUnit.state.enemies.forEach((enemy)=> {
			var enemyPos = new THREE.Vector2( enemy.position.x, enemy.position.y );
			var targetPos = new THREE.Vector2( enemy.targetPosition.x, enemy.targetPosition.y );
			var prevPos = new THREE.Vector2( enemy.prevPosition.x, enemy.prevPosition.y );
			var distance = enemyPos.distanceTo(targetPos);
			if(distance<= 0.02) {
				var direction = that.random(enemy.direction);
				var dir = consts.direction[direction];
				var pos = { x: targetPos.x + dir.x, y: targetPos.y + dir.y }
				// 更新现有位置
				enemy.position = { x: targetPos.x, y: targetPos.y }

				// 重新规划下一个目的地
				if(groundUnit.outBlock(pos) &&
					distance>3 && distance <= 50
				) {
					enemy.prevPosition = { x: targetPos.x, y: targetPos.y };
					enemy.targetPosition = pos;
					enemy.direction = direction;
				} else {
					var dirDic = {
						'w': 's',
						's': 'w',
						'a': 'd',
						'd': 'a',
					}
					enemy.prevPosition = { x: targetPos.x, y: targetPos.y };
					enemy.targetPosition = { x: prevPos.x, y: prevPos.y };
					enemy.direction = dirDic[enemy.direction];
				}
			} else {
				enemy.position = { x: enemyPos.x + (targetPos.x - enemyPos.x)*consts.enemyV, y: enemyPos.y + (targetPos.y - enemyPos.y)*consts.enemyV }
			}
		})

		enemyUnit.updateEnemies(enemyUnit.state.enemies);
	}
	updateModel() {
		const enemyUnit = this.store.getUnit('enemy');
		const groundUnit = this.store.getUnit('ground');
		var self = this;
		// 获取新的敌人
		enemyUnit.state.enemies.forEach(enemy=>{
			let monster = self.meshes[enemy.enemyId];
			if(enemy.isKilled) {
				// 移除敌人
				if(monster && !enemy.dead) {
					console.log('die')
					monster.die()
					enemy.dead = true;
					monster.die();
				}
			} else {
				if(monster) {
					monster.updatePosition(enemy.position);
					monster.updateDirection(enemy.direction);
				} else {
					monster = new Monster(enemy.typeId);
					monster.born(enemy.position);

					self.meshes[enemy.enemyId] = monster;
					// monster.born({x:0,y:0});
					self.parent.models.push(monster);

				}
			}
			monster.updateAnimation();
		})
	}

	random(direction) {
		var dirDic = {
			'w': ['w','a','d'],
			's': ['s','d','a'],
			'a': ['a','s','w'],
			'd': ['d','w','s'],
		}
		// 随机构建用户操作
		var rdmInt = Math.round(Math.random()*1000)%3;
		var dir = dirDic[direction][rdmInt];
		return dir;
	}

	collision() {
		var player = this.parent.hero;
		var playerMesh = player.meshes.children[0];
		if(!playerMesh) return false;
		// 获取物体中心点坐标
		var originPoint = playerMesh.position.clone();
		originPoint.z = 0.2;

		var vector3dList = [
			new Vector3(0,1,0),
			new Vector3(1,0,0),
			new Vector3(0,-1,0),
			new Vector3(-1,0,0)
		];

		var meshes = [];
		for(var key in this.meshes) {
			var monster = this.meshes[key];
			var mesh = monster.meshes.children[0];
			if(mesh) meshes.push(mesh);
		}

		for(var detla=0;detla<=10;detla++) {
			for (var vertexIndex = 0; vertexIndex < vector3dList.length; vertexIndex++) {
					// 将方向向量初始化,并发射光线
					var ray = new THREE.Raycaster(originPoint, vector3dList[vertexIndex].normalize(), 0, 20);
					// 检测射线与多个物体的相交情况
					// 如果为true，它还检查所有后代。否则只检查该对象本身。缺省值为false
					var collisionResults = ray.intersectObjects(meshes, true);
					// 如果返回结果不为空，且交点与射线起点的距离小于物体中心至顶点的距离，则发生了碰撞
					var item = collisionResults.find(result=> result.distance <= 0.5)
					if(item) return true;
			}
			originPoint.z += 0.2;
		}

		return false;
	}


	detection() {
		const enemyUnit = this.store.getUnit('enemy');
		const playerUnit = this.store.getUnit('player');
		return enemyUnit.state.enemies.filter((enemy)=> {
			// 1. 判断怪物是否撞到玩家
			// [18.07.22]修改为碰撞检测
			// var distance = playerUnit.distance(enemy.position);
			if(this.collision()) {
				// alert('怪物撞到玩家')
				this.parent.gameOver = true;
				return true;
			}
			// 2. 判断怪物是否撞到行驶路线上
			var isOut = playerUnit.outPath(enemy.position, 0.1);
			if(!isOut) {
				// alert('怪物撞到玩家行驶路径')
				this.parent.gameOver = true;
				return true;
			}
			return false;
		}).length > 0;
	}
}
