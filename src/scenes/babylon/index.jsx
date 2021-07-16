import * as BABYLON from 'babylonjs';
import BabylonScene from "../../core/scenes/babylonScene";

export default class BabylonDemoScene extends BabylonScene {
    async Start() {
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this.scene);
        // create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation 
        // var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 1, this.scene);
        // create a built-in "ground" shape;
        this.ground = BABYLON.Mesh.CreateGround('ground1', 100, 100, 100, this.scene);

        var material0 = new BABYLON.StandardMaterial("mat0", this.scene);
        material0.diffuseColor = new BABYLON.Color3(1, 0, 0);
        
        var material1 = new BABYLON.StandardMaterial("mat1", this.scene);
        material1.diffuseColor = new BABYLON.Color3(0, 0, 1);
    
        var material2 = new BABYLON.StandardMaterial("mat2", this.scene);
        material2.diffuseColor = new BABYLON.Color3(0, 1, 0);

        var multimat = new BABYLON.MultiMaterial("multi", this.scene);
        multimat.subMaterials.push(material0);
        multimat.subMaterials.push(material1);
        multimat.subMaterials.push(material2);

        this.ground.material = multimat;

        var verticesCount = this.ground.getTotalVertices();

        this.ground.subMeshes.push(new BABYLON.SubMesh(2, 0, verticesCount, 0, 100*20*6, this.ground));
        this.ground.scaling.set(6,1, 6);

        this.ground.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, 100*20*6, 100*20*6, this.ground));
        this.ground.subMeshes.push(new BABYLON.SubMesh(2, 0, verticesCount, 200*20*6, 100*20*6, this.ground));

        this.hero = await BABYLON.SceneLoader.LoadAssetContainerAsync('../../assets/babylon/', 'hero.babylon', this.scene);
        this.hero.addAllToScene();

        const position = this.hero.meshes[0].position;
        this.ground.position.set(position.x, position.y, position.z)

        // this.scene.stopAllAnimations();

        this.camera.position.set(0, 440, -850)
        this.camera.setTarget(this.hero.meshes[0].position);


        setTimeout(()=>{
            this.scene.stopAllAnimations();
            this.die();
        }, 10000)
        this.run();
    }
    Update() {

    }
    End() {

    }

    run() {
        this.scene.beginAnimation(this.hero.skeletons[0],0,18, true, 1);
        this.scene.beginAnimation(this.hero.skeletons[1],0,18, true, 1);
    }

    die() {
        this.scene.beginAnimation(this.hero.skeletons[0],25,50, false, 1);
        this.scene.beginAnimation(this.hero.skeletons[1],25,50, false, 1);
    }

}