(function(){{


    /* **************************************** *
    * Globals
    * **************************************** */
    let clock = new THREE.Clock();
    let model = null;


    /* **************************************** *
    * Scene
    * **************************************** */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b21ee');


    /* **************************************** *
    * Camera
    * **************************************** */
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 3.5;


    /* **************************************** *
    * Controls
    * **************************************** */
    const renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild( renderer.domElement );


    /* **************************************** *
    * Controls
    * https://threejs.org/docs/#examples/en/controls/OrbitControls 
    * **************************************** */
    const controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableZoom = false;


    /* **************************************** *
    * Lights
    * **************************************** */
    const light1 = new THREE.PointLight( 0xffffff, 0.5, 0 );
    light1.position.set( -200, 100, 100 );
    scene.add( light1 );

    const light2 = new THREE.PointLight( 0xffffff, 1, 0 );
    light2.position.set( 100, 200, 100 );
    scene.add( light2 );


    /* **************************************** *
    * Texture Loader
    * **************************************** */
    const textureLoader = new THREE.TextureLoader();


    /* **************************************** *
    * Materials
    * **************************************** */

    // Default 
    const material = new THREE.MeshPhysicalMaterial( { 
        transparent : true,
        color: 0xffeb3b,
        //map : new THREE.TextureLoader().load( 'textures/cloud_2048.jpg' ),
        //flatShading : true
    } );

    // Custom shader material ( see index.html )
    /*
    uniforms = {

        'fogDensity': { value: 0 },
        'fogColor': { value: new THREE.Vector3( 0, 0, 0 ) },
        'time': { value: 1.0 },
        'uvScale': { value: new THREE.Vector2( 3.0, 1.0 ) },
        'texture1': { value: textureLoader.load( '../textures/cloud.png' ) },
        'texture2': { value: textureLoader.load( '../textures/lava.jpg' ) }

    };
    uniforms[ 'texture1' ].value.wrapS = uniforms[ 'texture1' ].value.wrapT = THREE.RepeatWrapping;
    uniforms[ 'texture2' ].value.wrapS = uniforms[ 'texture2' ].value.wrapT = THREE.RepeatWrapping;

    const shaderMaterial = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    } );
    */


    /* **************************************** *
    * Load model
    * **************************************** */
    // Explode mesh in blender using fracture plugin
    const loader = new THREE.GLTFLoader();
    loader.load( '../models/skull.glb', function ( gltf ) {
            
            // Set and add model
            model = gltf.scene;
            model.traverse( function ( object ) {
                if ( object.isMesh ) {
                    object.material = material; //shaderMaterial;
                }
            } )

            scene.add( model );

            // Init scroll motion
            scrollMotion();
        },

        // called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },

        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
            console.log(error);
        }
    );


    /* **************************************** *
    * Render
    * **************************************** */
    function render() {

      /* 
      // Shader animation 
      const delta = 5 * clock.getDelta();
      uniforms[ 'time' ].value += 0.2 * delta;
      */

      renderer.render( scene, camera );

    }


    /* **************************************** *
    * Animate
    * **************************************** */
    function animate() {

        render();
        requestAnimationFrame( animate );

    }



    /* **************************************** *
    * Animate on scroll
    * **************************************** */
    function scrollMotion () {

        const tl = new gsap.timeline();

        tl.to(model.rotation, {easing : "Power3", y : Math.PI*2, duration:0.8});
        
        /*
        tl.addLabel('explodeLabel')
        model.traverse( function ( object ) {
            if ( object.isMesh ) {
                tl.to(object.rotation, {easing : "Power3", x : Math.PI, z : Math.PI, duration:0.8},'explodeLabel');
            }
        } );
        */

        ScrollTrigger.create({
            trigger: 'body',
            start:"top top",
            end:"bottom bottom",
            // markers:true,
            scrub:1.2, // smooth scroll animation
            animation:tl,
        });

    }


    // Run
    render();
    animate();


}})();