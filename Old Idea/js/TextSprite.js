/*
 * TextSprite.JS
 *
 * Create text sprites that appear inside a THREE.JS scene.
 *
 * Adapted from Three.JS example shared by Lee Stemkoski
 */

/*
 *
 * Example usage

	var spritey = TextSprite.create( " Hello, ", 
		{ fontsize: 24, fontface: "Arial", borderColor: {r:255, g:0, b:0, a:1.0}, backgroundColor: {r:255, g:100, b:100, a:0.8} } );
	spritey.position.set(-85,105,55);
  spritey.scale.set(100, 50, 1.0);
	scene.add( spritey );
*/
class TextSprite
{
	/*
	 * create
	 * Create as text sprite which is a THREE.Sprite object
	 * whose texture image map is dynamically created by
	 * drawing the given text message into an off-screen 2D HTML canvas.
	 * @param message - Non-empty text message given as a string.
	 * @param parameters JavaScript object that contains arguments:
	 * Example:
	 *   { fontsize: 24, 
	 *     fontface: "Arial", 
	 *     borderColor: {r:255, g:0, b:0, a:1.0}, 
	 *     backgroundColor: {r:255, g:100, b:100, a:0.8} }
	 *
	 * pre-conditions: Text message is non-empty and is assumed to
	 * be displayed on a single line. 
	 *
	 * Future work:
	 * Update to allow an option to draw the text into an off-screen
	 * HTML canvas over multiple lines.
	 *
	 * @return THREE.Sprite object ready to be added into a THREE.JS Scene.
	 *         Height of sprite object is 1.0 units along the +Y-axis direction.
	 *         Width is computed to preserve the aspect ratio of the rendered text.
	 */
  static create(message, parameters) 
	{
    if (parameters === undefined) parameters = {};

    var fontface = parameters.hasOwnProperty("fontface") ?
		parameters["fontface"] : "Arial";

    var fontsize = parameters.hasOwnProperty("fontsize") ?
		parameters["fontsize"] : 18;

    var borderThickness = parameters.hasOwnProperty("borderThickness") ?
		parameters["borderThickness"] : 4;

    var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };

    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r: 255, g: 255, b: 255, a: 1.0 };

		// Create an off-screen HTML canvas of default dimensions.
		// We will initially use this canvas simply to estimate the
		// size of the text message drawn using our desired font.
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
				
    context.font = "Bold " + fontsize + "px " + fontface;

    // Estimate width and height of off-screen canvas needed
		// to draw the text message.
    var metrics = context.measureText(message);
    var textWidth = metrics.width;
		
		var rectWidth = textWidth + borderThickness;
		// 1.4 is extra height factor for text below baseline: g,j,p,q.
		var rectHeight = fontsize * 1.4 + borderThickness;
		
		// Resize off-screen canvas.
    canvas.width = rectWidth;
		canvas.height = rectHeight;
    context = canvas.getContext('2d');
    // Post-condition: canvas and all attributes are cleared.
		// We must re-specify any drawing context settings made prior
		// to re-sizing the canvas.
		context.font = "Bold " + fontsize + "px " + fontface;

		// Clear canvas to single color.
		context.fillStyle = "yellow";
		context.fillRect(0, 0, canvas.width, canvas.height);

    // background color
    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
    // border color
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
   
		// Optional: Draw surrounding message box container into which 
		// text message will appear.
		
		// Style 1. Rounded rectangle message box.
	  var topLeftX = borderThickness / 2;
		var topLeftY = borderThickness / 2;
		var rectRadius = Math.ceil( Math.min(rectWidth, rectHeight) * 0.25 );
		// Draw filled rounded rectangle into off-screen canvas.
	  TextSprite.roundRect(context, topLeftX, topLeftY, rectWidth, rectHeight, rectRadius);
    
		// Draw text message.
    // text color
    context.fillStyle = "rgba(0, 0, 0, 1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    // Create THREE.JS texture map from off-screen canvas.
    var texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    /*
     * Three.JS Version 77.1 uses the following argument object in its
     * constructor method.
     * parameters = {
     *  color: <hex>,
     *  opacity: <float>,
     *  map: new THREE.Texture( <Image> ),
     *
     *	uvOffset: new THREE.Vector2(),
     *	uvScale: new THREE.Vector2()
    * }
    */
    var spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
    var sprite = new THREE.Sprite(spriteMaterial);
		
		// Scale rectangle billboard polygon so that it preserves the
		// aspect ratio of the canvas text rectangle.
		var rectAspect = rectWidth / rectHeight;
		sprite.scale.y = 1.0;
		sprite.scale.x = rectAspect;
		
    return sprite;
  }

  /*
   * roundRect
   * Draw filled rounded rectangle.
	 * @param ctx - HTML canvas 2D drawing context.
	 * @param x - Top-left x-coordinate in canvas pixels.
	 * @param y - Top-left y-coordinate in canvas pixels.
	 * @param w - Width of rectangle in canvas pixels.
	 * @param h - Height of rectangle in canvas pixels.
	 * @param r - Radius in pixels of circular arc in four corners.
	 */
  static roundRect(ctx, x, y, w, h, r) 
	{
		// Begin rounded rectangle path sequence of lines and curved arcs.
    ctx.beginPath();
		// straight horizontal line on top edge: moveTo top-left corner then lineTo top-right corner.
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
		// rounded top-right corner
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		// straight vertical line on right edge.
    ctx.lineTo(x + w, y + h - r);
		// rounded bottom-right corner.
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		// straight horizontal line on bottom edge.
    ctx.lineTo(x + r, y + h);
		// rounded bottom-left corner.
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
		// straight vertical line on left edge.
    ctx.lineTo(x, y + r);
		// rounded top-left corner.
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
		// Fill interior of rounded rectangle path with current fillStyle color.
    ctx.fill();
		// Outline rounded rectangle path with current strokeStyle color.
    ctx.stroke();
  }
}