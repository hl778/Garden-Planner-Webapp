/**
 * This is the main js file for Draw Page
 *
 * @flow
 * 1. create a Three.js scene
 * 2. create a HTML camera object
 * 3. initialise models
 *  3.1 create object holders in global scope, so each function can access them
 *
 * @tags
 *  #button a reminder to-be added button control
 *  #optimize potential causes for performance issues and slow-down
 *  #keep keep the comment-outed code for future use
 */


/*---------------------------------global scope variables----------------------------*/
// total object on scene counter offset
// there are 2 objects(floor points and lines Mesh) which can not be count during run-time
// when adding floor, change this to 2
let globalCounter = 2;
//main control GUI instance of dat.GUI
let Testcontrols;
let plantPointer = "";

/**
 * Initialization for the scene and objects
 */


function init() {


    /*---------------------------------top level scope variables----------------------------*/
    /*-----------------------------FPS-------------------------*/
    // use util.js, show FPS info
    let stats = initStats();
    /*-----------------------------scene-------------------------*/
    // global scene holds all our elements
    let scene= new THREE.Scene();
    // #button distance fog
    scene.fog = new THREE.FogExp2(0x000000, 0.005);
    /*-----------------------------camera-------------------------*/
    // camera viewpoint
    let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    // setup consciousness camera
    camera.position.set(3, 0.1, 0);//1.5, 0.1, 0.1
    camera.lookAt(scene.position);
    /*-----------------------------renderer-------------------------*/
    // global renderer
    let renderer = new THREE.WebGLRenderer({alpha: true,antialias: false});
    // set renderer size
    renderer.setSize(window.innerWidth * 0.72, window.innerHeight * 0.86);
    // set renderer opacity and color
    // #button set opacity
    renderer.setClearColor(new THREE.Color(0x000000),0.001);
    renderer.shadowMap.enabled = true;
    /*-----------------------------ground plane-------------------------*/
    // create ground plane shape and set size
    let planeGeometry = new THREE.PlaneGeometry(0.5, 0.5, 1, 1);
    // create ground plane material
    let planeMaterial = new THREE.MeshBasicMaterial({color: 0xAAAAAA, wireframe: true});
    // create ground plane mesh
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    // rotate plane to horizontal and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    // add the plane to the scene
    scene.add(plane);
    globalCounter++;
    /*-----------------------------Ambient Light-------------------------*/
    // subtle ambient lighting
    let ambientLight = new THREE.AmbientLight(0x3c3c3c);
    scene.add(ambientLight);
    globalCounter++;
    /*-----------------------------Spot Light-------------------------*/
    // light source one
    let spotLight = new THREE.SpotLight(0xffffff, 1.5);
    // set light source properties
    spotLight.position.set(-40, 40, 2215);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    scene.add(spotLight);
    globalCounter++;
    /*-----------------------------scene div container-------------------------*/
    // div holds the whole scene
    let sceneContainer = document.getElementById('sceneContainer');
    //put scene into div
    sceneContainer.appendChild(renderer.domElement);


    var sunlightVertices = [
        new THREE.Vector3(1, 3, 1),
        new THREE.Vector3(1, 3, -1),
        new THREE.Vector3(1, -1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, 3, -1),
        new THREE.Vector3(-1, 3, 1),
        new THREE.Vector3(-1, -1, -1),
        new THREE.Vector3(-1, -1, 1)
    ];

    var sunlightFaces = [
        new THREE.Face3(0, 2, 1),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(4, 6, 5),
        new THREE.Face3(6, 7, 5),
        new THREE.Face3(4, 5, 1),
        new THREE.Face3(5, 0, 1),
        new THREE.Face3(7, 6, 2),
        new THREE.Face3(6, 3, 2),
        new THREE.Face3(5, 7, 0),
        new THREE.Face3(7, 2, 0),
        new THREE.Face3(1, 3, 4),
        new THREE.Face3(3, 6, 4),
    ];

    var sunlightGeom = new THREE.Geometry();
    sunlightGeom.vertices = sunlightVertices;
    sunlightGeom.faces = sunlightFaces;
    sunlightGeom.computeFaceNormals();

    var materials = [
        new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true}),
        new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true})
    ];

    var sunlightMesh = THREE.SceneUtils.createMultiMaterialObject(sunlightGeom, materials);
    sunlightMesh.castShadow = true;
    sunlightMesh.children.forEach(function (e) {
        e.castShadow = true
    });

    scene.add(sunlightMesh);
    globalCounter++;

    /*----------------------------instance of GUI-------------------------*/
    //an object of new controls will be passed into GUI
    Testcontrols = new function () {
        // model scale
        this.Scale = 0.2;
        // z axes of plants
        this.Pan = 0;
        // x axes of plants
        this.Distance = 0;
        this.Rotate = 0;
        // total models currently on scene
        this.Number_Of_Plants = 0;
        // name of current selected plant
        // default quotes, .json implementation
        this.Selected = " A world in a grain of sand ";
        // delete the last added model
        this.Remove_Last_Plant = function () {
            let allChildren = scene.children;
            let lastModel = allChildren[allChildren.length - 1];
            if (lastModel instanceof THREE.Object3D && scene.children.length > globalCounter + 1) {
                scene.remove(lastModel);
                // get pointer points to the last-1 plant
                let nameTemp = lastModel.name.substring(0, lastModel.name.length - 4) + '_' +
                    (scene.children.length - globalCounter - 1).toString();
                // update plant pointer
                plantPointer = nameTemp;
                console.log('!!!--> You deleted a plant, current plant pointer points to:' + plantPointer);
                this.Number_Of_Plants = scene.children.length - globalCounter - 1;
                objects.pop();
            }
        };
        // add a new model
        this.Add_Plant = function () {
            // obj3dTemp stores a single Model
            let obj3dTemp = new THREE.Object3D();
            //create, load and add models
            obj3dTemp = loadSetModelAndMaterial(mtlLoader, loader, scene, objects,
                'assets/obj/', 'assets/obj/', 'gerberaPlant.obj',
                'gerberaPlant.mtl', obj3dTemp);
            // add object3D to a group to use later
            plantModelHolder.add(obj3dTemp);
            // update Number_Of_Plants listener
            this.Number_Of_Plants = scene.children.length - globalCounter;
        };
        // debug purpose only, show all models in console
        this.Objects_Array = function () {
            console.log("---------Current objects in scene:---------------");
            console.log("Total number of Objects: " + scene.children.length);
            console.log(scene.children);
            console.log("---------Current Models in scene:---------------");
            console.log("Total number of Models: " + (scene.children.length - globalCounter - 1));
            console.log(objects);
        }
        // camera control
        this.Scene_Heigh = 1.09;
        this.Scene_Distance = 6.5;
        this.Scene_LeftRight = 0;
        // floor control
        this.Floor_Length = 50.5;
        this.Floor_Width = 50;
        // must be even int
        this.Floor_Length_Density = 2;
        this.Floor_Width_Density = 0.2;
        this.Floor_Distance = 1.23;
        this.Floor_Height = 1;
        this.Floor_Left_Right = 24.12;
        this.Display_Floor = true;
        // environment control
        this.Lighting = 10;
        this.Default_Lighting = false;

    };

    // Sunlight control
    function addSunlightControl(x, y, z) {
        var controls = new function () {
            this.x = x;
            this.y = y;
            this.z = z;
        };
        return controls;
    }

    var sunlightControlPoints = [];
    sunlightControlPoints.push(addSunlightControl(3, 5, 3));
    sunlightControlPoints.push(addSunlightControl(3, 5, 0));
    sunlightControlPoints.push(addSunlightControl(3, 0, 3));
    sunlightControlPoints.push(addSunlightControl(3, 0, 0));
    sunlightControlPoints.push(addSunlightControl(0, 5, 0));
    sunlightControlPoints.push(addSunlightControl(0, 5, 3));
    sunlightControlPoints.push(addSunlightControl(0, 0, 0));
    sunlightControlPoints.push(addSunlightControl(0, 0, 3));
    // set environment fog control constants
    // to map -0.4 to -0.00001, to 1 to 10
    // SCALE a value to fit the destination range, then TRANSFORM it to the differences
    // Why need this: user interface usability
    Object.defineProperty(Testcontrols, 'fogMapDiff', {
        value: 10,
        writable: false,
        configurable: false
    });
    Object.defineProperty(Testcontrols, 'fogMapmultiple', {
        value: 22.5,
        writable: false,
        configurable: false
    });
    /*----------------------------GUI-------------------------*/
    // GUI control
    let globalGUI = new dat.gui.GUI();

    // instances of preset
    globalGUI.remember(Testcontrols);
    //set property of GUI controls
    globalGUI.add(Testcontrols, 'Selected').listen(); //name of selected plant
    globalGUI.add(Testcontrols, 'Number_Of_Plants').listen();
    globalGUI.add(Testcontrols, 'Add_Plant');
    globalGUI.add(Testcontrols, 'Remove_Last_Plant');
    // plant model control
    let guiFolderPlants = globalGUI.addFolder('Plant Control');
    guiFolderPlants.add(Testcontrols, 'Scale', 0.1, 3).step(0.01);
    guiFolderPlants.add(Testcontrols, 'Pan', -5, 5).step(0.01);
    guiFolderPlants.add(Testcontrols, 'Distance', -5, 5).step(0.01);
    guiFolderPlants.add(Testcontrols, 'Rotate', -5, 5).step(0.01);
    // camera control
    let guiFolderCamera = globalGUI.addFolder('Scene Control');
    guiFolderCamera.add(Testcontrols, 'Scene_Heigh', -0.2, 10.5).step(0.01);
    guiFolderCamera.add(Testcontrols, 'Scene_Distance', -1.2, 80).step(0.01);
    guiFolderCamera.add(Testcontrols, 'Scene_LeftRight', -2.2, 5.5).step(0.01);
    // floor control
    // let guiFolderFloor = globalGUI.addFolder('Floor Control');
    // guiFolderFloor.add(Testcontrols, 'Floor_Length',1,5).step(0.5);
    // guiFolderFloor.add(Testcontrols, 'Floor_Width',2,50).step(1);
    // guiFolderFloor.add(Testcontrols, 'Floor_Length_Density',2,20).step(2);
    // guiFolderFloor.add(Testcontrols, 'Floor_Width_Density',1,8).step(1);
    // guiFolderFloor.add(Testcontrols, 'Floor_Distance',0.1,3).step(0.01);
    // guiFolderFloor.add(Testcontrols, 'Floor_Height',0.3,3).step(0.01);
    // guiFolderFloor.add(Testcontrols, 'Floor_Left_Right',-3,3).step(0.01);
    // guiFolderFloor.add(Testcontrols, 'Display_Floor');

    // Environment control
    let guiFolderEnvironment = globalGUI.addFolder('Environment Control');
    guiFolderEnvironment.add(Testcontrols, 'Default_Lighting');
    guiFolderEnvironment.add(Testcontrols, 'Lighting', 1, 10).step(0.00001);
    // console debug control
    let guiFolderDebug = globalGUI.addFolder('Console Debug Control');
    guiFolderDebug.add(Testcontrols, 'Objects_Array');

    let guiFolderSunlight = globalGUI.addFolder('Sunlight');
    guiFolderSunlight.add(new function () {
        this.clone = function () {

            var clonedGeometry = mesh.children[0].geometry.clone();
            var materials = [
                new THREE.MeshLambertMaterial({opacity: 0.8, color: 0xff44ff, transparent: true}),
                new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
            ];

            var mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeometry, materials);
            mesh2.children.forEach(function (e) {
                e.castShadow = true
            });

            mesh2.translateX(5);
            mesh2.translateZ(5);
            mesh2.name = "clone";
            scene.remove(scene.getChildByName("clone"));
            scene.add(mesh2);


        }
    }, 'clone');

    for (var i = 0; i < 8; i++) {

        f1 = guiFolderSunlight.addFolder('Vertices ' + (i + 1));
        f1.add(sunlightControlPoints[i], 'x', -10, 10);
        f1.add(sunlightControlPoints[i], 'y', -10, 10);
        f1.add(sunlightControlPoints[i], 'z', -10, 10);

    }

    /*----------------------------free camera view-------------------------*/
    // the trackball controls and the clock which is needed, free camera view
    let trackballControls;
    // initialize the trackball controls and the clock which is needed, free camera view
    trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();
    /*----------------------------model loader-------------------------*/
    // creat a model loader
    let loader = new THREE.OBJLoader();
    /*----------------------------material loader-------------------------*/
    // loader for mtl file
    let mtlLoader = new THREE.MTLLoader();
    /*----------------------------model grouper-------------------------*/
    // holds plant model
    let plantModelHolder  = new THREE.Group();
    /*----------------------------model array holder-------------------------*/
    // array holds models
    let objects = [];
    /*----------------------------RGB axes-------------------------*/
    // helper axes xyz
    let axes = new THREE.AxesHelper(20);
    scene.add(axes);
    /*----------------------------drag drop control-------------------------*/
    // object handles drag and drop feature
    let controls = new THREE.DragControls(objects, camera, renderer.domElement);
    // drag drop controls
    controls.addEventListener('dragstart', dragStartCallback);
    controls.addEventListener('dragend', dragendCallback);
    controls.addEventListener('drag', dragCallback);
    /*----------------------------drag-start material-------------------------*/
    // drag-start on an object, stores its current material
    let dragControlStartMaterial;
    /*----------------------------window resize listener-------------------------*/
    // listen to window resize events
    window.addEventListener('resize', onResize, false);
    /*----------------------------------WebCam-------------------------------*/
    //add HTML camera to page
    initCamera(window.innerWidth, window.innerHeight);
    /*----------------------------------Floor perspective-------------------------------*/
    // we don't need y here, but just in case useful in the coming release
    let floorPerspectiveYSize = 1;
    // x axes for floor guideline
    let floorPerspectiveXSize;
    // z axes for floor guideline (distance)
    let floorPerspectiveZSize;
    // floor geometry
    let floorPointsGeometry = new THREE.BufferGeometry();
    floorPointsGeometry.dynamic = true;
    // color of floor geometry
    let floorPerspectiveColors = [];
    // position of floor geometry
    let floorPositionArray = [];
    // volume of floor
    let floorPerspectiveVolume;
    // floor guideline RGB color range
    const floorColorRange = 800;



    // floor guideline
    floorPerspectiveRenderer();

    /**
     *  re-draw floor each interval
     */
    function floorPerspectiveRenderer() {
        // control the length of floor
        let floorColOffset = Testcontrols.Floor_Length;
        floorPerspectiveXSize = Testcontrols.Floor_Width;
        floorPerspectiveZSize = Testcontrols.Floor_Length_Density;
        floorPerspectiveVolume = floorPerspectiveXSize * floorPerspectiveYSize * floorPerspectiveZSize * floorColOffset;
        // defines how many lines get colored
        let floorColorSegments = floorPerspectiveVolume;
        // initial fill color array of floor lines
        initialFloorPointsColor();
        // initial fill position array of floor points
        initialFloorPositionIndex();
        // initialise points of floor
        let floorPositionAttribute = new THREE.Float32BufferAttribute(floorPositionArray, 3);
        // add floor xyz positions to the position attribute
        floorPointsGeometry.setAttribute("position", floorPositionAttribute);
        let floorIndexPointsMaterial = new THREE.PointsMaterial({ size: 0.04 });
        // create points
        let floorIndexPoints = new THREE.Points(floorPointsGeometry,floorIndexPointsMaterial);
        // an array of lines connecting index points
        let floorIndexPairs = [];
        // pair index points
        floorPairIndex();
        // set geometry index points
        floorPointsGeometry.setIndex(floorIndexPairs);
        let floorLinesMaterial = new THREE.LineBasicMaterial( { vertexColors: true });
        // create lines
        let floorLines = new THREE.LineSegments(floorPointsGeometry,floorLinesMaterial);
        // set name to be identified later
        floorIndexPoints.name="floorIndexPoints";
        floorLines.name="floorLines";
        //#optimize remove floor at each interval
        scene.remove( scene.getObjectByName(floorIndexPoints.name) );
        scene.remove( scene.getObjectByName(floorLines.name) );
        // GUI control, whether to display floor guideline
        if (Testcontrols.Display_Floor) {
            scene.add(floorIndexPoints);
            scene.add(floorLines);
        }
        //#optimize garbage dispose
        floorPointsGeometry.dispose();
        floorLinesMaterial.dispose();
        floorIndexPointsMaterial.dispose();
        // scene.dispose();
        // #optimize another method to update things
        // for (let i = 0; i < floorPerspectiveVolume; i++) {
        //     let p = floorPerspectiveMapTo3D(i);
        //     let a = p.x + p.y + p.z;
        //     floorPointsGeometry.attributes.position.array[3 * i + 0] ;
        //     floorPointsGeometry.attributes.position.array[3 * i + 1];
        //     floorPointsGeometry.attributes.position.array[3 * i + 2];
        // }
        // floorPointsGeometry.attributes.position.needsUpdate = true;
        // set color of floor lines
        floorPointsGeometry.setAttribute(
            'color', new THREE.Float32BufferAttribute( floorPerspectiveColors, 3 )
        );

        /**
         * push position into an array
         */
        function initialFloorPositionIndex() {
            for (let i = 0; i < floorPerspectiveVolume; i++) {
                let p = floorPerspectiveMapTo3D(i);
                floorPositionArray[i * 3] = (p.x - floorPerspectiveXSize / Testcontrols.Floor_Distance) / Testcontrols.Floor_Width_Density;
                // this will floor go above the origin point 0,0,0
                // floorPositionArray[i*3+1] = (p.y - floorPerspectiveYSize / 10) / 1+Testcontrols.Floor_Height;
                // #defines floor y height
                floorPositionArray[i * 3 + 1] = (p.y - floorPerspectiveYSize / 10) / Testcontrols.Floor_Height;
                // #defines floor left and right
                floorPositionArray[i * 3 + 2] = (p.z - floorPerspectiveZSize / 2) / floorPerspectiveZSize - Testcontrols.Floor_Left_Right;
            }
        }
        /*--------------------------------pairing floor Index----------------------------------*/
        /**
         *
         */
        function floorPairIndex() {
            for (let i = 0; i < floorPerspectiveVolume; i++) {
                let p = floorPerspectiveMapTo3D(i);
                if (p.x + 1 < floorPerspectiveXSize) {
                    floorIndexPairs.push(i);
                    floorIndexPairs.push(floorPerspectiveMapFrom3D(p.x + 1, p.y, p.z));
                }
                // useful in the future #keep
                // if (p.y + 1 < floorPerspectiveYSize) {
                //     floorIndexPairs.push(i);
                //     floorIndexPairs.push(floorPerspectiveMapFrom3D(p.x, p.y + 1, p.z));
                // }
                // #defines fill col row
                if (p.z + 1 < floorPerspectiveZSize*floorColOffset) {
                    floorIndexPairs.push(i);
                    floorIndexPairs.push(floorPerspectiveMapFrom3D(p.x, p.y, p.z + 1));
                }
            }
        }
        /* -------------------initial floor guideline Color and position---------------------*/
        /**
         *
         */
        function initialFloorPointsColor() {
            for ( let i = 0; i < floorColorSegments; i ++ ) {
                // random-color horizon implementation
                // #keep for future release
                // let x = Math.random() * floorColorRange - floorColorRange / 2;
                // let y = Math.random() * floorColorRange - floorColorRange / 2;
                // let z = Math.random() * floorColorRange - floorColorRange / 2;
                // floorPerspectiveColors
                floorPerspectiveColors.push(0.9);
                floorPerspectiveColors.push(0.9);
                floorPerspectiveColors.push(i * 0.009);
                // #keep for future release
                // floorPerspectiveColors.push( ( x / floorColorRange ) + 0.5 );
                // floorPerspectiveColors.push( ( y / floorColorRange ) + 0.5 );
                // floorPerspectiveColors.push( ( z / floorColorRange ) + 0.5 );
            }
        }
        /*--------------------------------floor Perspective MapTo3D----------------------------------*/
        /**
         *
         * @param i
         * @returns {{x: number, y: number, z: number}}
         */
        function floorPerspectiveMapTo3D(i) {
            let z = Math.floor(i / (floorPerspectiveXSize * floorPerspectiveYSize));
            i -= z * floorPerspectiveXSize * floorPerspectiveYSize;
            let y = Math.floor(i / floorPerspectiveXSize);
            let x = i % floorPerspectiveXSize;
            return { x: x, y: y, z: z };
        }
        /*--------------------------floor Perspective MapFrom3D----------------------------*/
        /**
         *
         * @param x
         * @param y
         * @param z
         * @returns {*}
         */
        function floorPerspectiveMapFrom3D(x, y, z) {
            return x + y * floorPerspectiveXSize + z * floorPerspectiveXSize * floorPerspectiveYSize;
        }
    }
    /* *************************End of floorPerspectiveRenderer()************************ */

    /*----------------------------ready to render-------------------------*/
    renderScene();
    //-----------------------------------floor img----------------------------------//
    // #keep for future release, load images
    // let groundImageMaterial = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'assets/img/floor-clipart-perspective-transparent.png' ), transparent: true, opacity: 0.5, color: 0xFF0000 });
    // let groundImageGeometry = new THREE.PlaneGeometry(10, 10*.75);
    // combine our image geometry and material into a mesh
    // groundImageMesh = new THREE.Mesh(groundImageGeometry, groundImageMaterial);
    // set the position of the image mesh in the x,y,z dimensions
    // groundImageMesh.position.set(0,-10,0)
    // add the image to the scene
    // scene.add(groundImageMesh);
    // groundImageMesh.rotation.x = -1.3;
    // groundImageMesh.scale.set(40, 20, 20);

    /*--------------------------------render Functions----------------------------------*/
    /**
     * This is the interval rendering for animation
     * @note everything needs updates goes here
     */
    function renderScene() {
        // current pressed key
        let key;
        //avoid conflict between camera and drag-drop of models feature
        document.onkeydown = function(e) {
            e = e || window.event;
            key = e.which || e.keyCode;
            //only activate free-camera mode when 'q' is pressed down
            if (key === 81) {
                //update camera using TackballControl
                trackballControls.update(clock.getDelta());
                controls.dispose();
            } else {
                //known bug, need to click another key
                controls.activate();
            }
        }
        if (scene.children.length > globalCounter + 1) {
            // transform plant name into index number
            // temp var to store current plant pointer name
            let nameTemp = plantPointer;
            // RegExp to extract all the digits from name String
            let indexName = nameTemp.match(/\d/g);
            // delete commas
            indexName = indexName.join("");
            // parse String to int
            indexName = parseInt(indexName) - 1;
            objects[indexName].scale.x = Testcontrols.Scale;
            objects[indexName].scale.z = Testcontrols.Scale;
            objects[indexName].scale.y = Testcontrols.Scale;
            objects[indexName].position.x = -Testcontrols.Distance;
            objects[indexName].position.z = -Testcontrols.Pan;
            objects[indexName].rotation.y = Testcontrols.Rotate;
        }
        var sunVertices = [];
        for (var i = 0; i < 8; i++) {
            sunVertices.push(new THREE.Vector3(sunlightControlPoints[i].x, sunlightControlPoints[i].y, sunlightControlPoints[i].z));
        }
        sunlightMesh.children.forEach(function (e) {
            e.geometry.vertices = sunVertices;
            e.geometry.verticesNeedUpdate = true;
            e.geometry.computeFaceNormals();
            delete e.geometry.__directGeometry
        });
        //a new cycle for Frame monitor
        stats.update();
        // camera control
        camera.position.y = Testcontrols.Scene_Heigh;
        camera.position.x = Testcontrols.Scene_Distance;
        camera.position.z = Testcontrols.Scene_LeftRight;
        // simulate lighting control through fog
        if (Testcontrols.Default_Lighting) {
            scene.fog = new THREE.FogExp2(0x000000, 0.005);
        } else {
            // those constants are to map -0.4 to -0.00001, to 1 to 10
            scene.fog = new THREE.FogExp2(0x000000, (Testcontrols.Lighting - Testcontrols.fogMapDiff) /
                Testcontrols.fogMapmultiple);
        }
        // render using requestAnimationFrame for interval purpose
        requestAnimationFrame(renderScene); //called interval
        renderer.render(scene, camera);
    }

    /*************************************helper Functions********************************************/
    /* ---------------------------screen resize eventExecutor--------------------------*/
    /**
     * This is the Executor on screen resize
     * @eventListener is 'resize' on windows
     */
    function onResize() {
        initCamera();
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth * 0.72, window.innerHeight * 0.86);
    }

    window.onload = function () {

        const breakdownButton = document.querySelectorAll('.plantImg');
        breakdownButton.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var plantImgName = this.id;
                // obj3dTemp stores a single Model
                let obj3dTemp = new THREE.Object3D();
                //create, load and add models
                obj3dTemp = loadSetModelAndMaterial(mtlLoader, loader, scene, objects,
                    'assets/obj/', 'assets/obj/', plantImgName + '.obj',
                    plantImgName + '.mtl', obj3dTemp);
                // add object3D to a group to use later
                plantModelHolder.add(obj3dTemp);
                // update Number_Of_Plants listener
                Testcontrols.Number_Of_Plants = scene.children.length - globalCounter;
                // var img = document.createElement('img');
                // img.setAttribute('src', 'http://blog.stackoverflow.com/wp-content/uploads/stackoverflow-logo-300.png');
                // e.target.appendChild(img);
            });
        });


    };


}
/* **************************************End of init()************************************** */


/* ****************************All the other global helper Functions*************************** */
/* ---------------------------drag Callback--------------------------*/
/**
 * when dragging, move only on x and z axes
 * @param event mouse event when mouse pressed
 */
function dragCallback(event) {
    event.object.position.x = (event.object.position.y) * -3;
    event.object.position.y = 0;
}
/* ---------------------------drag start Callback--------------------------*/
/**
 * when drag starts, set color
 * @param event mouse event when mouse pressed
 */
function dragStartCallback(event) {
    plantPointer = event.object.parent.name;
    // display a single selected plant model's name
    // delete the last 2 char holds suffix, example: _1
    Testcontrols.Selected = event.object.parent.name.substring(0, event.object.parent.name.length - 2);
    // highlight selected plant mtl
    let material = new THREE.MeshStandardMaterial({color: 0x2194CE});
    dragControlStartMaterial = event.object.material;
    event.object.material = material;
}
/* ---------------------------drag end Callback--------------------------*/
/**
 * when drag ends, set color back
 * @param event mouse event when mouse released
 */
function dragendCallback(event) {
    event.object.material = dragControlStartMaterial;
}
/* ---------------------------initCamera--------------------------*/
/**
 * initialise camera
 * @param width user defined camera width
 * @param height user defined camera height
 * @note this will be called each time when resize window
 */
function initCamera(width,height) {
    // Grab elements, create settings, etc.
    let liveCamera = document.getElementById('liveCamera');
    let liveCameraWidth = width;
    let liveScene_Height = height;
    let compatibleBrowser = hasUserMedia();
    let liveCameraResolution = getBrowserVideoSettings(compatibleBrowser, liveCameraWidth, liveScene_Height);
    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({
            video: liveCameraResolution,
            audio: false
        }).then(function (stream) {
            //video.src = window.URL.createObjectURL(stream);
            //A variable called 'toggle' is created and the toggle button is accessed by DOM and saved to this variable.
            var toggle = document.querySelector('input[type="checkbox"]');
            //A variable called 'status' is created and the status message is accessed by DOM and saved to this variable.
            var status = document.getElementById("cameraStatus");

            //Event listeners are then added to 'toggle'.
            toggle.addEventListener('change', function () {
                //If the toggle button is activated (turned on), then the camera is enabled. Otherwise if the toggle button is turned off, then the camera is disenabled.
                if (toggle.checked) {
                    document.getElementById("AR_Tip").style.display = "inline";
                    // enable camera
                    console.log('Camera on');
                    //The status message is changed.
                    status.innerHTML = "AR View - Camera ON";
                    //This is the key part of the code that allows the camera to turn on.
                    liveCamera.srcObject = stream;
                    // Show loading animation.
                    let playPromise = liveCamera.play();
                    if (playPromise !== undefined) {
                        playPromise.then(_ => {
                            // Automatic playback started!
                            // Show playing UI.
                            // We can now safely pause video...
                            video.pause();
                        })
                            .catch(error => {
                                // Auto-play was prevented
                                // Show paused UI.
                            });
                    }
                } else {
                    console.log('Camera off');
                    //The status message is changed.
                    status.innerHTML = "Canvas View - Camera OFF";
                    //              stream.getTracks().forEach(function(track) { track.stop(); })
                    //The function 'initCamera()' is called again because this function sets up the camera but only turns it on if the toggle switch is changed to 'ON'. The canvas is not reset so work is not lost, it is the camera that is reset.
                    liveCamera.srcObject = initCamera();
                }
            });

        });
    }
}
/* ---------------------------hasUserMedia--------------------------*/
/**
 * This requests permission of video
 * @return permission
 */
function hasUserMedia() {
    MediaDevices.getUserMedia = MediaDevices.getUserMedia ||
        MediaDevices.webkitGetUserMedia ||
        MediaDevices.mozGetUserMedia;
    return MediaDevices.getUserMedia;
}
/* ---------------------------getBrowserVideoSettings--------------------------*/
/**
 * This gets width and height of a browser
 * @param browser get video permission from browser
 * @param width user defined width
 * @param height user defined height
 * @return width and height
 */
function getBrowserVideoSettings(browser, width, height) {
    if (browser === navigator.mozGetUserMedia) {
        return {
            width: width,
            height: height
        }
    } else {
        return {
            mandatory: {
                minWidth: width,
                minHeight: height
            }
        }
    }
}
/* ------------------------------------Load models------------------------------------*/
/**
 * This loads models on at a time
 * @param mtlLoader mtlLoader object
 * @param loader loader object
 * @param scene primary scene
 * @param objects an array holds all 3D models
 * @param modelPath file path for a single 3D model
 * @param materialPath file path for a single material
 * @param modelName filename of a single 3D model
 * @param materialName filename of a single material
 * @returns {*} A group object holds a single 3D model
 */
function loadSetModelAndMaterial(mtlLoader, loader, scene, objects, modelPath, materialPath, modelName, materialName, obj3dTemp) {
    // path for materials
    mtlLoader.setPath(materialPath);
    //load materials and models
    mtlLoader.load(materialName, function (materials) {
        materials.preload();
        // model path
        loader.setPath(modelPath);
        // load model
        loader.load(
            // resource URL
            modelName,
            // called when resource is loaded
            function(object) {
                obj3dTemp = object;
                obj3dTemp.name = modelName.substring(0, modelName.length - 4) + '_' +
                    (scene.children.length - globalCounter).toString();
                plantPointer = obj3dTemp.name;
                console.log('--> Current plantPointer points to: ' + plantPointer);
                obj3dTemp.scale.set(0.2, 0.2, 0.2);
                obj3dTemp.position.x = Math.random() * (1 + 1) - 1;
                obj3dTemp.position.y = 0;
                obj3dTemp.position.z = 0;
                scene.add(obj3dTemp);
                obj3dTemp.traverse(function (child) {
                    if (child.type === 'Mesh') {
                        // bis = child;
                        // delete the last 4 char holds extension, example: .obj
                        // obj3dTemp.name = modelName.substring(0, modelName.length - 4);
                        console.log('--> You added: ' + obj3dTemp.name + ' as below');
                        objects.push(obj3dTemp);
                        console.log(obj3dTemp);
                    }
                });
            },
            // called when loading is in progresses
            function(xhr) {
                console.log(('--> ' + xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function(error) {
                console.log('!!!!!!!--> An error happened while loading ' + modelName +
                    '\n!!!!!!!--> This is the ' + (scene.children.length - globalCounter).toString() + 'th Model');
            }
        );
        // set materials
        loader.setMaterials(materials);
    });
    return obj3dTemp;
}

/* ------------------------------------Save Canvas Button------------------------------------*/
/**
 * This saves the canvas (id sceneContainer) so that it only captures the garden drawing.
 */

var saveCanvas = function () {

    //Save users choice of either saving or not saving.
    var userChoice;

    //If save clicks 'save' then the garden drawing will be saved and the status message will be updated to confirm this.
    if (confirm("Do you want to save changes?") == true) {
        userChoice = "Your garden has been saved!";
        //update 'saveStatus' message.
        document.getElementById("saveStatus").innerHTML = userChoice;
        //The 'html2canvas' script allows part of a webpage to be screenshot. The screenshot is based on the DOM.
        html2canvas(document.getElementById("sceneContainer"), {
            onrendered: function (canvas) {
                //Creates canvas to be captured.
                var gardenCanvas = document.createElement('canvas');
                //Width and height can be adjusted depending on how much of the webpage we want to capture.
                gardenCanvas.width = 500;
                gardenCanvas.height = 500;
                var context = gardenCanvas.getContext('2d');
                //Test to check correct part of webpage is being accessed.
                //            context.beginPath();
                //            context.rect(20, 20, 150, 100);
                //            context.stroke();
                //Below values can be adjusted to select how much of canvas.
                context.drawImage(canvas, 120, 0, 280, 100, 1, 1, 300, 300);
                var screenshot = document.createElement("a");
                screenshot.href = gardenCanvas.toDataURL('image/jpg');
                //Name of canvas
                screenshot.download = 'myGarden.jpg';
                //When '.click()' activated, saves locally.
                screenshot.click();
            }
        });
    } else {
        userChoice = "You decided not to save your garden.";
        //update 'saveStatus' message.
        document.getElementById("saveStatus").innerHTML = userChoice;
    }
}


/* ------------------------------------Position for Optimal Sunlight GROUNDWORK------------------------------------*/

//This code follows a basic drag n drop mouse event algorithm that merely does the following:
//The basic Drag’n’Drop algorithm looks like this:

//1. Prepare the element for moving (mousedown)
//2. When mouse moved, move it by changing left/top properties and position (mousemove)
//3. Drop the element (mouseup)


//This produces a working idea of how the sun position in the user's garden is set, the grid is displayed on the canvas and if a plant selected needs sunlight for optimal growth, the part of the grid directly underneath the sun position is highlighted to indicate that this is the best position in the user's garden to grow the selected plant. 


//Show position for optimal sunlight
var showOptimalSunlight = function () {
    //Unhide elements
    document.getElementById("plantObject").style.visibility = "visible";
    document.getElementById("grid1").style.visibility = "visible";
    document.getElementById("grid2").style.visibility = "visible";
    document.getElementById("grid3").style.visibility = "visible";
    document.getElementById("sun").style.visibility = "visible";
}


//Variable plantToPosition set to null. This tracks the position on the canvas and will remain null until it matches the coordinates in the optimal position.
var plantToPosition = null;

//A function called 'onmousedown' is used and is activated when a user presses an element using their mouse/cursor.
plantObject.onmousedown = function (event) {

    //These variables stores the x and y coordinates of the plant object before it is moved/dragged to another position on the canvas.
    var xCoordinateBeforeDragged = event.clientX - plantObject.getBoundingClientRect().left;
    var yCoordinateBeforeDragged = event.clientY - plantObject.getBoundingClientRect().top;

    //The position of the plant object is kept 'absolute' and its z-index ensures it remains on top of the canvas and the grid.
    plantObject.style.position = 'absolute';
    plantObject.style.zIndex = +1;


    //The function 'currentPosition()' calculates the current x and y coordinates of the plant object.
    function currentPosition(pageX, pageY) {
        //The CSS style elements of the plant object is updated to move the plant object.
        plantObject.style.left = pageX - xCoordinateBeforeDragged + 'px';
        plantObject.style.top = pageY - yCoordinateBeforeDragged + 'px';
    }

    //The function 'onMouseMove()' is activated when the cursor (plant object) is moving while over an element.
    function onMouseMove(event) {
        currentPosition(event.pageX, event.pageY);

        //The object is hidden 
        plantObject.hidden = true;
        //The variable 'positionNear' returns the element that is located at the specified coordinates.
        var positionNear = document.elementFromPoint(event.clientX, event.clientY);
        plantObject.hidden = false;

        //The variable 'optimalPosition' uses the method '.closest()' to retrieve the parent or closest ancestor of 'sunlightPosition'.
        var optimalPosition = positionNear.closest('.sunlightPosition');
        //If the two variables, one containing the element located at current position and the other the area nearest to sunlightPosition, do not meet then we can still place the plant using 'placePlant' but it also means the plant object is not over the sunlight position.
        if (plantToPosition != optimalPosition) {
            console.log(plantToPosition);
            if (plantToPosition) {
                placePlant(plantToPosition);
            }
            plantToPosition = optimalPosition;
            if (plantToPosition) {
                //If the two variables match, highlight position.
                highlightOptimalPosition(plantToPosition);
            }
        }
    }


    document.addEventListener('mousemove', onMouseMove);

    //This allows the object to be placed. If not included the plant object will follow the cursor, this is locking the coordinates.
    plantObject.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
    };

};

//The position is highlighted by accessing its styling priorities.
function highlightOptimalPosition(optimalPos) {
    optimalPos.style.background = 'yellow';
}

function placePlant(optimalPos) {
    optimalPos.style.background = '';
}

//.'ondragstart' function is activated when the user starts to drag an element.
plantObject.ondragstart = function () {
    return false;
};


/* ------------------------------------Position for Optimal Sunlight ALGORITHM SOLUTION PSEUDOCODE------------------------------------*/

//Using the above code sets the groundwork but below algorithm (DESIGNED USING ABSTRACT VIEW/ABSTRACT REPRESENTATION OF SOLUTION THIS THE OPTIMAL SUNLIGHT PROBLEM) could be more ideal:


/* 

**PSEUDOCODE - VERY ABSTRACT REPRESENTATION**

ACCESS CANVAS LAYOUT GRID:

[[0,0],[0,1],[0,2],[0,3]]
[[1,0],[1,1],[1,2],[1,3]]
[[2,0],[2,1],[2,2],[2,3]]
[[3,0],[3,1],[3,2],[3,3]]
[[4,0],[4,1],[4,2],[4,3]]

GET POSITION OF SUN SET BY THE USER:
variable sunPosition = allow user to move sun around canvas and once dropped (using same code as above), lock the coordinates and store in this variable. E.g. sun is directly above position [0,0] of the grid.

GET PLANT SELECTED BY THE USER AND CHECK WHETHER IT REQUIRES THE SUN FOR OPTIMAL GROWTH:
variable plantSelected = plant selected by user;

if(plantSelected.sunProperty == "Yes")  //This plant object has a property called 'sunProperty' that contains 'yes' or 'no'{
    
    PROVIDE TIP AND HIGHLIGHT AREA ON GRID THAT COULD SUPPORT OPTIMAL GROWTH, BUT NOT COMPULSORY i.e. user can still place the plant anywhere on the grid and not in the highlighted area of the grid.
    
    calculate grid position around/near the sun position
    
    HIGHLIGHT GRID:
    if layout grid similar to a two-dimesional array where we can access each position in numeric form, highlight the optimal position this way:
    [0,0].colorProperty = yellow
    [0,1].colorProperty = yellow
    [1,0].colorProperty = yellow

    but if layout grid constructed using objects/shapes, access the individual object or vertex and highlight the optimal position this way:
    square 0 = fill(yellow)
    square 1 = fill(yellow)
}
else{
    allow plant to be placed anywhere on grid
}

*/


/* ---------------------------End of code--------------------------*/