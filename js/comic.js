var width = window.innerWidth;
      var height = window.innerHeight;

      var stage = new Konva.Stage({
        container: 'container',
        width: 800,
        height: 600
      });
      var layer = new Konva.Layer();
      stage.add(layer);

      // what is url of dragging element?
      var itemURL = '';
      document
        .getElementById('drag-items')
        .addEventListener('dragstart', function(e) {
          itemURL = e.target.src;
        });

      var con = stage.container();
      con.addEventListener('dragover', function(e) {
        e.preventDefault(); // !important
      });

      con.addEventListener('drop', function(e) {
        e.preventDefault();
        // now we need to find pointer position
        // we can't use stage.getPointerPosition() here, because that event
        // is not registered by Konva.Stage
        // we can register it manually:
        stage.setPointersPositions(e);

        Konva.Image.fromURL(itemURL, function(image) {
            layer.add(image);
		    image.position(stage.getPointerPosition());
            image.draggable(true);
			
            layer.draw();
        });
      });
	  
//----------------------------------------the code below is for the textarea-----------------------------------------------------------------------	  
	  
	   var textNode = new Konva.Text({
        text: 'Add your text here.',
        x: 50,
        y: 80,
        fontSize: 20,
        draggable: true,
        width: 200
      });

	  function addText(){
      layer.add(textNode);

	  }
      var tr = new Konva.Transformer({
        node: textNode,
        enabledAnchors: ['middle-left', 'middle-right'],
        // set minimum width of text
        boundBoxFunc: function(oldBox, newBox) {
          newBox.width = Math.max(30, newBox.width);
          return newBox;
        }
      });

      textNode.on('transform', function() {
        // reset scale, so only with is changing by transformer
        textNode.setAttrs({
          width: textNode.width() * textNode.scaleX(),
          scaleX: 1
        });
      });

      layer.add(tr);

      layer.draw();

      textNode.on('dblclick', () => {
        // hide text node and transformer:
        textNode.hide();
        tr.hide();
        layer.draw();

        // create textarea over canvas with absolute position
        // first we need to find position for textarea
        // how to find it?

        // at first lets find position of text node relative to the stage:
        var textPosition = textNode.absolutePosition();

        // then lets find position of stage container on the page:
        var stageBox = stage.container().getBoundingClientRect();

        // so position of textarea will be the sum of positions above:
        var areaPosition = {
          x: stageBox.left + textPosition.x,
          y: stageBox.top + textPosition.y
        };

		

        // create textarea and style it
        var textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        // apply many styles to match text on canvas as close as possible
        // remember that text rendering on canvas and on the textarea can be different
        // and sometimes it is hard to make it 100% the same. But we will try...
        textarea.value = textNode.text();
        textarea.style.position = 'absolute';
        textarea.style.top = areaPosition.y + 'px';
        textarea.style.left = areaPosition.x + 'px';
        textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
        textarea.style.height =
          textNode.height() - textNode.padding() * 2 + 5 + 'px';
        textarea.style.fontSize = textNode.fontSize() + 'px';
        textarea.style.border = 'none';
        textarea.style.padding = '0px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = 'left top';
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();
        rotation = textNode.rotation();
        var transform = '';
        if (rotation) {
          transform += 'rotateZ(' + rotation + 'deg)';
        }

        var px = 0;
        // also we need to slightly move textarea on firefox
        // because it jumps a bit
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isFirefox) {
          px += 2 + Math.round(textNode.fontSize() / 20);
        }
        transform += 'translateY(-' + px + 'px)';

        textarea.style.transform = transform;

        // reset height
        textarea.style.height = 'auto';
        // after browsers resized it we can set actual value
        textarea.style.height = textarea.scrollHeight + 3 + 'px';

        textarea.focus();
		

        function removeTextarea() {
          textarea.parentNode.removeChild(textarea);
          window.removeEventListener('click', handleOutsideClick);
          textNode.show();
          tr.show();
          tr.forceUpdate();
          layer.draw();
        }

        function setTextareaWidth(newWidth) {
          if (!newWidth) {
            // set width for placeholder
            newWidth = textNode.placeholder.length * textNode.fontSize();
          }
          // some extra fixes on different browsers
          var isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
          );
          var isFirefox =
            navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
          if (isSafari || isFirefox) {
            newWidth = Math.ceil(newWidth);
          }

          var isEdge =
            document.documentMode || /Edge/.test(navigator.userAgent);
          if (isEdge) {
            newWidth += 1;
          }
          textarea.style.width = newWidth + 'px';
        }

        textarea.addEventListener('keydown', function(e) {
          // hide on enter
          // but don't hide on shift + enter
          if (e.keyCode === 13 && !e.shiftKey) {
            textNode.text(textarea.value);
            removeTextarea();
          }
          // on esc do not set value back to node
          if (e.keyCode === 27) {
            removeTextarea();
          }
        });

        textarea.addEventListener('keydown', function(e) {
          scale = textNode.getAbsoluteScale().x;
          setTextareaWidth(textNode.width() * scale);
          textarea.style.height = 'auto';
          textarea.style.height =
            textarea.scrollHeight + textNode.fontSize() + 'px';
        });

        function handleOutsideClick(e) {
          if (e.target !== textarea) {
            textNode.text(textarea.value);
            removeTextarea();
          }
        }
        setTimeout(() => {
          window.addEventListener('click', handleOutsideClick);
        });
      });
	  
	  
//-------------------------------------------------------------------------------------------------------------------------------------------------	  
//-----------------------------------------------Transform method----------------------------------------------------------------------------------	
	/*
	 * Transformer
	 * The way to transform something
	 *
	 *
	 * @param e - whatever is clicked
	 */
	  stage.on('click tap', function(e) {
        // if click on empty area - remove all transformers
        if (e.target === stage) {
          stage.find('Transformer').destroy();
          layer.draw();
          return;
        }
        //
        // remove old transformers
        stage.find('Transformer').destroy();

        // create new transformer
        var tr = new Konva.Transformer();
        layer.add(tr);
        tr.attachTo(e.target);
        layer.draw();
      });
	  
//---------------------------------------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------Right-click Menu-------------------------------------------------------------------------


/*
      stage.on('dblclick dbltap', function() {
        // add a new shape
        var newShape = new Konva.Circle({
          x: stage.getPointerPosition().x,
          y: stage.getPointerPosition().y,
          radius: 10 + Math.random() * 30,
          fill: Konva.Util.getRandomColor(),
          shadowBlur: 10
        })
        layer.add(newShape);
        layer.draw();
      });
	  
*/

      // setup menu
      let currentShape;
      var menuNode = document.getElementById('menu');
     

      document.getElementById('delete-button').addEventListener('click', () => {
        currentShape.destroy();
        layer.draw();
      });
	  
	  document.getElementById('clone-button').addEventListener('click', () => {
		var clone = currentShape.clone({
        x : 50,
        y : 50
    });
		layer.add(clone);
		layer.draw();

      });

      window.addEventListener('click', () => {
        // hide menu 
          menuNode.style.display = 'none';
      })


      stage.on('contextmenu', function(e) {
        // prevent default behavior
        e.evt.preventDefault();
        if (e.target === stage) {
          // if we are on empty place of the stage we will do nothing
          return;
        }
        currentShape = e.target;
        // show menu
        menuNode.style.display = 'initial';
        var containerRect = stage.container().getBoundingClientRect();
        menuNode.style.top = containerRect.top + stage.getPointerPosition().y + 4 +'px';
        menuNode.style.left = containerRect.left + stage.getPointerPosition().x + 4 + 'px';
      });


//---------------------------------------------------------------------------------------------------------------------------------------------------