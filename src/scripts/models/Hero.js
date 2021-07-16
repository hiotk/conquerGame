import Model from "../../core/models/Model";

export default class Hero extends Model {
    constructor() {
        super();
        this.mesh = null;
        this.mixer = null;
        this.paused = true;
        this.meshes = new THREE.Group();
        this.scale = 0.005;
        this.meshes.scale.set(this.scale, this.scale, this.scale)
        this.meshes.rotateX(THREE.Math.degToRad(90));
        this.meshes.rotateY(THREE.Math.degToRad(180));
        this.visible = true;
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

    preload(url) {
        if(this.loaded) return;
        var self = this;
        var loader = new THREE.JDLoader();
        loader.load(url, (data) => {
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
                        Hero.mixers.push(mixer);
                        var action = mixer.clipAction(mesh.geometry.animations[0] );
                        action.play();
                    }

                    if(mesh) {
                        // var helper = new THREE.SkeletonHelper( mesh );
                        // helper.material.linewidth = 3;
                        // this.scene.add(helper);
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

    updateDirection(direction) {
        // 更新英雄的动画
        var delta = this.clock.getDelta();
        if(this.paused && this.meshes.children.length>0) {
            for(var i=0;i<this.meshes.children.length;i++) {
                var mesh = this.meshes.children[i];
                if(mesh && mesh.mixer) {
                    mesh.mixer.update(delta);
                }
            }
        };
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
        /** 记录玩家游戏界面朝向 */
        this.direction = direction;
        /** 更新实际朝向 */
        let forward = new THREE.Vector3(0,0,-1);
        forward.applyQuaternion(this.meshes.quaternion);
        forward.normalize();
        this.forward = forward;
    }

    play(animationName) {
        // 播放动画
        for(var i=0;i<this.meshes.children.length;i++) {
            var mesh = this.meshes[i];
            if (mesh && mesh.geometry.animations && mesh.mixer)
            {
                var clips = mesh.geometry.animations;
                var clip = THREE.AnimationClip.findByName( clips, animationName );
                var action = mesh.mixer.clipAction( clip );
                action.play();
            }
        }
        this.paused = false;
    }

    stop() {
        // 暂停动画
        this.paused = true;
    }

    updatePosition(position) {
        if(this.loaded) {
            /** 更新实际位置 */
            this.position = {
                ...position,
                z: 0.01
            };
            /** 更新玩家界面位置 */
            this.meshes.position.x = this.position.x;
            this.meshes.position.y = this.position.y;
        }
    }
}
