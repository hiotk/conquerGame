export default {
	direction : {
		w: { x: 0, y: 1 },
		s: { x: 0, y: -1 },
		a: { x: -1, y: 0 },
		d: { x: 1, y: 0 }
	},
	gridCount: 20, // 网格数量
	CA_CLEAR: 1,
	CA_TRAIL: 2,
	enemyV: 0.05,
	playerV: 1,
	playerSize: 0.7,
	monsterScores: [ 10, 50, 100 ],
	blocksScores: (blocksCount)=>{
		if(blocksCount>20) return blocksCount * 5;
		if(blocksCount>15) return blocksCount * 4;
		if(blocksCount>10) return blocksCount * 3;
		if(blocksCount>5) return blocksCount * 2;
		if(blocksCount>1) return blocksCount * 1;
	}
}
