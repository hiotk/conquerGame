import Model from "../../core/models/Model";


function fract(value) {
    if(value>0) {
        return value - Math.floor(value);
    } else {
        return Math.ceil(value) - value;
    }
}

export default class HeroShader extends Model {

    constructor() {
        super();
        this.meshes = new THREE.Group();
        this.visible = true;
        this.shaderMesh = null;
        this.InitShader();
    }

    static vertex = `
        attribute float size;
        attribute vec4 color;
        attribute float birthTime;


        varying vec4 vColor;

        uniform float time;
        uniform float velocity;
        uniform vec3 direction;
        uniform vec3 curPosition;

        void main() {
            float vTime = 1.0 - step(birthTime, fract(time)) + (fract(time)-birthTime);
            vec3 offset = direction * vTime * velocity;
            vec4 mvPosition = modelViewMatrix * vec4( position + offset - curPosition, 1.0 );
            vColor = color;
            gl_PointSize = size * (1.0 - vTime);
            gl_Position = projectionMatrix * mvPosition;
        }
    `
    static fragment = `
        varying vec4 vColor;
        uniform sampler2D texture;
        void main() {
            gl_FragColor = vColor;
            gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
        }
    `

    Start() {
        this.scene.add(this.meshes);
    }

    Update() {
        super.Update();
        var delta = this.clock.getDelta();
        if(this.shaderMesh) {
            this.shaderMesh.material.uniforms.time.value += delta * 0.5;
        }
    }

    updatePosition(position) {
        var pos = { x: position.x, y: position.y, z: 0.01 }
        this.meshes.position.set(pos.x, pos.y, pos.z);
        var time = this.shaderMesh.material.uniforms.time.value;
        var birthTimes = this.shaderMesh.geometry.attributes.birthTime;
        var positions = this.shaderMesh.geometry.attributes.position;
        var randomPositons = this.shaderMesh.geometry.attributes.randomPositon;
        var count = positions.count;
        for(var i=0; i<count; i++) {
            var birthTime = birthTimes.getX(i);
            if(Math.abs(birthTime - fract(time))<0.1) {
                var randomPos = {x:randomPositons.getX(i),y: randomPositons.getY(i),z: randomPositons.getZ(i)}
                positions.setXYZ(i, pos.x+randomPos.x, pos.y+randomPos.y, pos.z)
            }
        }
        positions.needsUpdate = true;

        this.shaderMesh.material.uniforms.curPosition.value = this.meshes.position;
    }

    InitShader() {
        var count = 50; // 粒子数量
        var color = new THREE.Color( 0x000000 ); // 粒子颜色
        var radius = 0.4; // 粒子生成半径
        var direction = new THREE.Vector3(0,0,1); // 往Z轴方向
        var velocity = 0.5; // 粒子运动速度
        var size = 10;

        var geometry = new THREE.BufferGeometry();
        var positions = [];
        var randomPositons = [];
        var colors = [];
        var birthTime = [];
        var sizes = [];
        for(var i=0; i<count; i++) {
            var position = [ (0.5 - Math.random())*radius,  (0.5 - Math.random())*radius, 1 ];
            positions.push(...position);
            randomPositons.push(...position);
            colors.push(color.r+Math.round(Math.random()*128)/255, color.g+Math.round(Math.random()*128)/255, color.b+Math.round(Math.random()*128)/255, 1.0);
            sizes.push(size);
            birthTime.push(Math.random());
        }

        var positionAttr = new THREE.BufferAttribute(new Float32Array(positions), 3 );
        positionAttr.needsUpdate = true;
        geometry.addAttribute('position',  positionAttr);
        geometry.addAttribute('randomPositon',  new THREE.BufferAttribute( new Float32Array(randomPositons), 3 ));
        geometry.addAttribute('color',  new THREE.BufferAttribute( new Float32Array(colors), 4 ));
        geometry.addAttribute('size', new THREE.BufferAttribute( new Float32Array(sizes), 1));
        geometry.addAttribute('birthTime', new THREE.BufferAttribute( new Float32Array(birthTime), 1));

        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 1.0 },
                direction: { value: direction },
                velocity: { value: velocity },
                texture: { value: new THREE.TextureLoader().load( "./assets/images/dot.png" ) },
                curPosition: { value: this.meshes.position }
            },
            vertexShader: HeroShader.vertex,
            fragmentShader: HeroShader.fragment,
            blending:       THREE.AdditiveBlending,
            depthTest:      true,
            transparent:    true
        })
        this.shaderMesh = new THREE.Points(geometry, shaderMaterial);

        this.meshes.add(this.shaderMesh);
    }
}
