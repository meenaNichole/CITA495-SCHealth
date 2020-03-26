/*
 *
 * SPRITE.JS
 *
 * Create sprites that appear within a THREE.JS scene.
 *
 * Adapted from TEXTSPRITE.JS example shared by Professor Bares.
 *
 */

/*
 * Example usage will be added here once code is completed.
 *
   
 *
 *
 *
 *
 *
 *
 *
 *
 */
 
class Sprite{ 


	/*
	 * constructor
	 * The way to create an "object type", is to use an object constructor function.
	 *
	 *
	 * @param name - name of sprite
	 * @param pose - sprite's list of poses
	 * @param file - name of the file
	 * @param height - height of the sprite
	 */
	constructor (name, poses, fileString, spriteHeight){
		this.name = name;
		this.poses = poses;
		this.fileString = fileString;
		this.spriteHeight = spriteHeight;
	}
	
	/*
	 * create function
	 * Create as sprite which is a THREE.Sprite object
	 * whose texture image map is dynamically created by
	 * drawing the given text message into an off-screen 2D HTML canvas.
	 */
	create(){
		
		textureLoader = new THREE.TextureLoader();
		var spriteImageMap = textureLoader.load(fileString);
		var spriteMaterial = new THREE.SpriteMaterial( { map: spriteImageMap, color: 0xffffff } );
		var sprite = new THREE.Sprite(spriteMaterial);
		

		sprite.scale.x = spriteHeight;
		sprite.scale.y = 1.0;

		return sprite;
		
	}
    
	function show(timeSeconds){}
	function hide(timeSeconds){}
	function setPose(timeSeconds, pose){}
	function moveTo(timeSeconds, point){}
	function moveToSmooth(timeSeconds, point){}
	function sizeTo(timeSeconds, spriteHeight){}
	function sizeToSmooth(timeSeconds, spriteHeight){}
	
	
