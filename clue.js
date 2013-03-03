// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());



var ClueJS=function () {
		ClueJS.video = document.createElement('video');
		ClueJS.backCanvas = document.createElement('canvas');
		ClueJS.canvas = document.querySelector('#output');
		ClueJS.canvas.style.display = 'none';
		ClueJS.context = ClueJS.canvas.getContext('2d');
		ClueJS.info = document.querySelector('#info');
	};

	ClueJS.prototype.interpret=function (stream) {
				console.log(ClueJS.video);
				ClueJS.video.addEventListener('canplay', function() {
					ClueJS.video.removeEventListener('canplay');
					setTimeout(function() {
						ClueJS.video.play();
						ClueJS.canvas.style.display = 'inline';
						ClueJS.info.style.display = 'none';
						ClueJS.canvas.width = ClueJS.video.videoWidth;
						ClueJS.canvas.height = ClueJS.video.videoHeight;
						ClueJS.backCanvas.width = ClueJS.video.videoWidth / 4;
						ClueJS.backCanvas.height = ClueJS.video.videoHeight / 4;
						ClueJS.backContext = ClueJS.backCanvas.getContext('2d');

						var w = 300 / 4 * 0.8,
							h = 270 / 4 * 0.8;

						ClueJS.comp = [{
							x: (ClueJS.video.videoWidth / 4 - w) / 2,
							y: (ClueJS.video.videoHeight / 4 - h) / 2,
							width: w, 
							height: h,
						}];

						ClueJS.drawToCanvas();
					}, 500);
				}, true);

			var domURL = window.URL || window.webkitURL;
			ClueJS.video.src = domURL ? domURL.createObjectURL(stream) : stream;
		};

		ClueJS.prototype.denied=function () {
			alert( 'Camera access denied!<br>Please reload and try again.');
		};

		ClueJS.prototype.error=function (e) {
			if (e) {
				console.error(e);
			}
			alert( 'Please go to about:flags in Google Chrome and enable the &quot;MediaStream&quot; flag.');
		};

		ClueJS.drawToCanvas=function () {
			requestAnimationFrame(ClueJS.drawToCanvas);
		
			var video = ClueJS.video,
				ctx = ClueJS.context,
				backCtx = ClueJS.backContext,
				m = 4,
				w = 4,
				i,
				comp;
		
			ctx.drawImage(video, 0, 0, ClueJS.canvas.width, ClueJS.canvas.height);
		
			backCtx.drawImage(video, 0, 0, ClueJS.backCanvas.width, ClueJS.backCanvas.height);
		
			comp = ccv.detect_objects(ClueJS.ccv = ClueJS.ccv || {
				canvas: ClueJS.backCanvas,
				cascade: cascade,
				interval: 4,
				min_neighbors: 1
			});
		
			if (comp.length) {
				ClueJS.comp = comp;
			}
		
			for (i = ClueJS.comp.length; i--; ) {
				console.log(ClueJS.comp[i].x + " , " +ClueJS.comp[i].y );
			}
		};

	ClueJS.prototype.start=function () {
		navigator.getUserMedia_ = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
		try {
			navigator.getUserMedia_({
				video: true,
				audio: false
			}, this.interpret, this.denied);
		} catch (e) {
			try {
				navigator.getUserMedia_('video', this.interpret, this.denied);
			} catch (e) {
				this.error(e);
			}
		}
		ClueJS.video.loop = ClueJS.video.muted = true;
		ClueJS.video.load();
	}

window.onload=function(){
	app = new ClueJS();
	app.start();
};
