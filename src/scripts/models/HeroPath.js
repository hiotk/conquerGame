import Model from "../../core/models/Model";

// 绘制路径
function pathGeometry(path) {
	var geometry = new THREE.BufferGeometry();
	var position = [];

	path.forEach(function(item, index) {
		position = position.concat([item.x, item.y, item.z])
		if(index!==0 && index!==(path.length-1)) {
			position = position.concat([item.x, item.y, item.z])
		}
	})

	geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
	return geometry;
}

export default class HeroPath extends Model {
    constructor() {
		super();
		this.visible = true;
	}

    updatePath(path) {
        if(path.length>1) {
			if(!this.pathMesh) {
				this.pathMesh = new THREE.LineSegments( pathGeometry(path), new THREE.LineDashedMaterial( { color: 0xffaa00, dashSize: 0.3, gapSize: 0.1, linewidth: 2 } ) );
				this.pathMesh.computeLineDistances();
				this.scene.add(this.pathMesh);
			} else {
				this.pathMesh.geometry = pathGeometry(path);
				this.pathMesh.computeLineDistances();
			}
			this.pathMesh.visible = true;
		} else {
			if(this.pathMesh) this.pathMesh.visible = false;
		}
    }
}