import Unit from "../../core/store/unit";
import UUID from 'uuid/v4'
import consts from '../consts'

export default class EnemyUnit extends Unit {
    constructor() {
        super('enemy');
        this.init();
    }

    init() {
        // 初始化数据
        this.state = {
            enemies: [
                {
                    enemyId: 0,
                    typeId: 1, // 预留字段,怪物类型
                    score: 50,
                    direction: 'd',
                    position: {
                        x: 3,
                        y: 3
                    },
                    targetPosition: {
                        x: 5,
                        y: 3
                    },
                    prevPosition: {
                        x: 3,
                        y: 3
                    },
                }
            ] // 所有敌人信息
        }
    }

    createEnemy(pos) {
        var rdmInt = Math.round(Math.random()*1000)%4;
		var direction = ['w','s','a','d'][rdmInt];
		var dir = consts.direction[direction];
		var newEnemy = {
            enemyId: UUID(),
			typeId: Math.round(Date.now() + Math.random()*1000) % 3,
			position: {
				x: pos.x,
				y: pos.y
			},
			targetPosition: {
				x: pos.x+dir.x*2,
				y: pos.y+dir.y*2
			},
			prevPosition: {
				x: pos.x,
				y: pos.y
			},
			direction: direction,
        }
        newEnemy.score = consts.monsterScores[newEnemy.typeId];
        this.state.enemies.push(newEnemy);
    }

    // 判断某一点是否有怪物活动
	outEnemy(position) {
		return this.state.enemies.filter(function(enemy) {
            return enemy.targetPosition.x === position.x && enemy.targetPosition.y === position.y
        }).length===0
    }

    updateEnemies(enemies) {
        this.state.enemies = enemies;
    }


    unitAction({ type, payload }) {
        console.log(type, payload);
    }
}
