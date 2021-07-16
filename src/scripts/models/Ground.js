import Model from "../../core/models/Model";
import GridPlane from "../utils/GridPlane";
import consts from "../consts";

export default class Ground extends Model {
    constructor() {
        super();
        var material1 = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('./assets/images/qt/db_1.png') } );
		var material2 = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('./assets/images/qt/db_2.png') } );
        this.gridPlane = new GridPlane( consts.gridCount, consts.gridCount, material1, material2 );
        this.gridPlane.mesh.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 * ( Math.PI/180 ) );
        this.visible = true;
    }

    Start() {
        this.scene.add( this.gridPlane.mesh );
    }

    updateFaceIndex(blocks) {
        this.gridPlane.updateFaceIndex(blocks);
    }
}
