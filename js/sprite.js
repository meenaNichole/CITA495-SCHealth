<script src="js/three.min.js"></script>
<script src="js/controls/OrbitControls.js"></script>
<script>
class sprite{ 
    constructor(name,poseName,imageFilename,height){
        this.name= name;
        this.imageFilename=imageFilename;
        this.height=height;
        this.poseName=poseName;
    }
    
function init() {\
TextureLoader object.
textureLoader = new THREE.TextureLoader();
    
    var map=textureLoader.load(this.imageFilename)
    var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } ); 
    this.name= new THREE.Sprite(treeMaterial);
                
    // We need to figure out to do the backround in the sprite class or in a seperate class         
     var backGroundMaterial =new THREE.SpriteMaterial({map:background,color: 0xfffff,opacity:1.0});
    var backgroundSprite= new THREE.Sprite(backGroundMaterial);
    // how do we incorporate the postition, will we have to add position x ,y, and z?		
         scene.add(backgroundSprite);
				scene.add(this.name);
}