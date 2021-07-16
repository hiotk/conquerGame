import Model from "../../core/models/Model";

/**
 * 死亡状态自动变化说明：
 * isKilled=>dead=>removed
 * 1. isKilled 被玩家杀死
 * 2. dead 被玩家杀死后，自动触发dead=true，并播放死亡动画
 * 3. removed 死亡动画播放后，自动触发removed=true
 */
export default class Monster extends Model {
    constructor(type) {
        super();
        this.visible = true;
        this.paused = true;
        this.scale = 0.005;
        this.isKilled = false;
        this.dead = false;
        this.removed = false;
        this.meshes = new THREE.Group();
        this.meshes.scale.set(this.scale, this.scale, this.scale)
        this.meshes.rotateX(THREE.Math.degToRad(90));
        this.meshes.rotateY(THREE.Math.degToRad(180));
        this.type = type;
        this.url = [
            "./assets/bird/bird.JD",
            "./assets/EYU/EYU.JD",
            "./assets/EMO/emo.JD"
        ][this.type];
        this.childScale = [
            10, 4, 1
        ][this.type]
        // 预加载
        this.preload();
    }
    // 预留接口，暂未使用
    // 未来思考，将model移入scene管理
    static mixers = [];

    Start() {
        this.scene.add(this.meshes)
    }

    createMaterials(data)
    {
        var matArray = [];
        for (var j = 0; j < data.materials.length; ++j)
        {
            var mat = new THREE.MeshPhongMaterial({});
            mat.copy(data.materials[j]);
            matArray.push(mat);
        }
        return matArray;
    }

    preload() {
        if(this.loaded) return;
        var self = this;
        var loader = new THREE.JDLoader();
        loader.load(this.url, (data) => {
            for (var i = 0; i < data.objects.length; ++i)
            {
                if (data.objects[i].type == "Mesh" || data.objects[i].type == "SkinnedMesh")
                {
                    var mesh = null;
                    var matArray = this.createMaterials(data);
                    if (data.objects[i].type == "SkinnedMesh")
                    {
                        mesh = new THREE.SkinnedMesh(data.objects[i].geometry, matArray);
                    }
                    else
                    {
                        mesh = new THREE.Mesh(data.objects[i].geometry, matArray);
                    }

                    if (mesh && mesh.geometry.animations)
                    {
                        var mixer = new THREE.AnimationMixer(mesh);
                        mesh.mixer = mixer;
                        Monster.mixers.push(mixer);
                        console.log('moster')
                        var action = mixer.clipAction(mesh.geometry.animations[0] );
                        var dieAction = mixer.clipAction(mesh.geometry.animations[1] );
                        dieAction.setLoop(THREE.LoopOnce)
                        action.play();
                    }

                    if(mesh) {
                        // var helper = new THREE.SkeletonHelper( mesh );
                        // helper.material.linewidth = 3;
                        // this.scene.add(helper);
                        mesh.scale.set(this.childScale, this.childScale, this.childScale);
                        this.meshes.add(mesh);
                    }
                }
            }
            self.loaded = true;
        });
    }

    born(position) {
        this.updatePosition(position);
    }

    updatePosition(position) {
        this.position = {...position, z: 0.01 };
        this.meshes.position.x = this.position.x;
        this.meshes.position.y = this.position.y;
    }
    updateAnimation() {
        var delta = this.clock.getDelta();
        if(this.meshes.children.length>0) {
            for(var i=0;i<this.meshes.children.length;i++) {
                var mesh = this.meshes.children[i];
                if(mesh && mesh.mixer) {
                    mesh.mixer.update(delta);
                }
            }
        };
    }
    updateDirection(direction) {
        // // 更新英雄的动画
        // var delta = this.clock.getDelta();
        // if(this.paused && this.meshes.children.length>0) {
        //     for(var i=0;i<this.meshes.children.length;i++) {
        //         var mesh = this.meshes.children[i];
        //         if(mesh && mesh.mixer) {
        //             mesh.mixer.update(delta);
        //         }
        //     }
        // };
        // 更新英雄的朝向
        if(this.direction !== direction && this.meshes.children.length>0) {
            switch (direction) {
                case 'w':
                    this.meshes.rotation.set(Math.PI/2, Math.PI, 0, 'XYZ')
                    break;
                case 's':
                    this.meshes.rotation.set(Math.PI/2, 0, 0, 'XYZ')
                    break;
                case 'a':
                    this.meshes.rotation.set(Math.PI/2, -Math.PI/2, 0, 'XYZ')
                    break;
                case 'd':
                    this.meshes.rotation.set(Math.PI/2, Math.PI/2, 0, 'XYZ')
                    break;
                default:
                    break;
            }
        }
        this.direction = direction;
    }
    die() {
        // 播放动画
        for(var i=0;i<this.meshes.children.length;i++) {
            var mesh = this.meshes.children[i];
            if (mesh && mesh.geometry.animations && mesh.mixer)
            {
                var run = mesh.geometry.animations[0];
                var die = mesh.geometry.animations[1];
                //console.log(mesh.mixer)
                //mesh.mixer.stopAllAction ()
                var runAction = mesh.mixer.existingAction( run );
                var dieAction = mesh.mixer.existingAction(die);
                dieAction.clampWhenFinished = true
                dieAction.setLoop(THREE.LoopOnce)
                runAction.stop();
                dieAction.play();

                const duration = dieAction.getClip().duration;
                setTimeout(()=>{
                    // 敌人死亡动画播放完毕，需要移除物体
                    this.removed = true;
                    this.meshes.visible = false;
                    this.visible = false;
                    // this.meshes.children.forEach(child=>{
                    //     child.material.dispose();
                    //     child.geometry.dispose();
                    // })
                    // this.meshes.remove();
                }, duration*1000+200);
            }
        }
        this.paused = false;
    }
    play(animationName) {
        // 播放动画
        for(var i=0;i<this.meshes.children.length;i++) {
            var mesh = this.meshes.children[i];
            if (mesh && mesh.geometry.animations && mesh.mixer)
            {
                var clips = mesh.geometry.animations;
                var clip = THREE.AnimationClip.findByName( clips, animationName );
                //console.log(mesh.mixer)
                //mesh.mixer.stopAllAction ()
                var action = mesh.mixer.existingAction( clip );
                console.log(action)
                //action.setLoop(THREE.LoopOnce)
                if(action){
                    action.play();
                }
            }
        }
        this.paused = false;
    }

    stop() {
        // 暂停动画
        this.paused = true;
    }
}
