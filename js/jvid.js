;(function($){

	$.jVid = function(el, options){

		var base = this;

		base.$el = $(el);
		base.defaultOptions = {
			anim: 'fade',
			bgArrow: 'light',
			bgColor: 'rgba(0,0,0,.6)',
			bgShape: 'circle',
			borderColor: '#fff',
			mini: false
		};

		if (!base.$el.context) {
			base.$el = $('[data-video]');
			options = el;
		}

		base.options = $.extend({}, base.defaultOptions, options);
		base.options.borderColor = (base.options.borderColor === 'none') ? 'border:none' : 'border-color:'+base.options.borderColor;

		var jVid = '<div class="jVid' + (base.options.anim ? ' ' + base.options.anim : '') + (base.options.mini ? ' mini' : '') + '{{titleclass}}">'
				 + '{{iframe}}<div class="poster"><div class="bg" style="background-image:url({{thumb}})"></div><div class="fade"></div>'
				 + '<span class="play ' + base.options.bgShape + ' ' + base.options.bgArrow + '" '
				 + 'style="background-color:' + base.options.bgColor + ';' + base.options.borderColor + ';">'
				 + '</span><span class="title">{{title}}</span></div>'
				 + '</div>';

		var thumbs = {
			youtube: 'http://img.youtube.com/vi/ID/hqdefault.jpg',
			vimeo: 'http://vimeo.com/api/v2/video/ID.json?callback=showThumb'
		};

		var iframes = {
			vimeo: '<iframe src="//player.vimeo.com/video/ID?color=ffffff&title=0&byline=0&portrait=0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="display:none"></iframe>',
			youtube: '<iframe src="https://www.youtube.com/embed/ID?" allowfullscreen style="display:none"></iframe>'
		};

		function showVideo(iframe, poster){
			iframe.style.display = 'block';
			poster.style.display = 'none';
		}

		function clickPlay(){
			var poster = this;
			var iframe = poster.previousElementSibling;
			src = iframe.getAttribute('src');
			iframe.setAttribute('src', src+'&autoplay=1');
			poster.className = 'poster hide';
			window.setTimeout(showVideo, 700, iframe, poster);
		}

		function initHTML(jvid, video){
			jvid.innerHTML = jVid.replace('{{iframe}}', iframes[video.type].replace('ID', video.id))
				.replace('{{thumb}}', (video.type === 'vimeo') ? video.thumb : thumbs[video.type].replace('ID', video.id))
				.replace('{{titleclass}}', video.title ? ' title' : '')
				.replace('{{title}}', video.title ? video.title : '');
			jvid.getElementsByClassName('poster')[0].addEventListener('click', clickPlay);
		}

		base.init = function(){
			if (base.$el.length) {
				$.each(base.$el, function() {
					if (this.tagName !== 'DIV') return;
					var jvid = this,
						video = {
							id: this.getAttribute('data-video'),
							title: this.getAttribute('data-title')
						};
					video.type = isNaN(video.id) ? 'youtube' : 'vimeo';
					if (video.type === 'vimeo') {
						$.ajax({
							dataType: 'jsonp',
							success: function(data) {
								video.thumb = data[0].thumbnail_large;
								initHTML(jvid, video);
							},
							url: thumbs.vimeo.replace('ID', video.id)
						});
					} else {
						initHTML(jvid, video);
					}
				});
			}
		};

		base.init();

	};

	$.fn.jVid = function(options){
		return this.each(function(){
			(new $.jVid(this, options));
		});
	};

})(jQuery);
