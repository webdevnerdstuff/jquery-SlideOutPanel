(function($) {
	const pluginName = 'SlideOutPanel';

	// Create the defaults once //
	const defaults = {
		// Options //
		className: '',
		closeBtn: '',
		closeBtnSize: '',
		contentClass: '',
		footerClass: '',
		headerClass: '',
		headerText: '',
		offsetTop: 0,
		screenOpacity: '0.5',
		screenZindex: '9998',
		showFooter: true,
		showHeader: true,
		slideFrom: 'right',
		transitionDuration: '0.35s',
		position: '',
		showScreen: true,
		width: '350px',
		// Methods //
		afterClosed() {},
		afterOpen() {},
		beforeClosed() {},
		beforeOpen() {},
		rendered() {},
	};

	const soSettings = {};
	const soElements = {};

	// ---------------------------------------------------- SlideOutPanel constructor //
	function SlideOutPanel(element, options) {
		this.element = element;
		soElements[element.id] = element;

		// Merge defaults and options
		soSettings[element.id] = $.extend({}, defaults, options);

		// Set transitionDuration to INT //
		let transitionDuration = soSettings[element.id].transitionDuration;
		transitionDuration = transitionDuration.replace('s', '');
		soSettings[element.id].transitionDuration = parseFloat(transitionDuration);

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	// Avoid Plugin.prototype conflicts //
	$.extend(SlideOutPanel.prototype, {
		// ---------------------------------------------------- INIT //
		init() {
			// Collect slots //
			const headerHtml = $(`#${this.element.id} slot[name="header"]`).html();
			const contentHtml = $(`#${this.element.id} slot[name="content"]`).html();
			const footerHtml = $(`#${this.element.id} slot[name="footer"]`).html();

			// Remove slots container //
			$(`#${this.element.id}`).remove();

			// Add new container to page //
			this.addTemplate();

			// Build panel pieces //
			this.buildSoHeader(headerHtml);
			this.buildSoContent(contentHtml);
      this.buildSoFooter(footerHtml);

      soSettings[this.element.id].rendered.call();
		},
		// ---------------------------------------------------- ADD TEMPLATE //
		addTemplate() {
			const settings = soSettings[this.element.id];

			let soTemplate = '';
			soTemplate += `<div id="${this.element.id}" class="slide-out-panel-container">`;
			soTemplate += '<header class="slide-out-header"><h4></h4></header>';
			soTemplate += '<section class="slide-out-content"></section>';
			soTemplate += '<footer class="slide-out-footer"></footer>';
			soTemplate += '</div>';

			if (settings.showScreen) {
				soTemplate += `<div class="slide-out-panel-screen" data-id="${this.element.id}"></div>`;
			}

			$('body').append(soTemplate);

			// Add classes and styles to container //
			$(`#${this.element.id}.slide-out-panel-container`)
				.addClass(`${settings.slideFrom} ${settings.className}`)
				.css({
					display: 'block',
					height: settings.offsetTop === 0 ? 'initial' : `calc(100vh - ${settings.offsetTop})`,
					left: settings.slideFrom === 'right' ? 'initial' : `-${settings.width}`,
					position: settings.position,
					right: settings.slideFrom === 'left' ? 'initial' : `-${settings.width}`,
					top: settings.offsetTop,
					transitionDuration: `${settings.transitionDuration}s`,
					width: settings.width,
				});

			// Add Styles to Screen //
			$('.slide-out-panel-screen').css({
				backgroundColor: `rgba(0, 0, 0, ${settings.screenOpacity}`,
				transitionDuration: `${settings.transitionDuration}s`,
				zIndex: `-${settings.screenZindex}`,
			});
		},
		// ---------------------------------------------------- BUILD PANEL PIECES //
		// -------------------------- Header //
		buildSoHeader(headerHtml) {
			const settings = soSettings[this.element.id];
			const headerObj = $(`#${this.element.id}.slide-out-panel-container .slide-out-header`);

			// Check if showHeader should be displayed //
			if (!settings.showHeader) {
				headerObj.css({ display: 'none' });
				return false;
			}
			else if (settings.showHeader && !settings.headerText && !headerHtml) {
				// If header is visible and has no slot content, the headerText option must be set //
				this.destroyPanel(this.element.id, '"headerText" option is missing.');
				return false;
			}

			headerObj.addClass(settings.headerClass).children('h4').html(settings.headerText);

			if (headerHtml) {
				headerObj.html(headerHtml);
			}

			// Append close button //
			headerObj.append(this.closeBtn());
			return false;
		},
		// -------------------------- Content //
		buildSoContent(contentHtml) {
			const contentObj = $(`#${this.element.id}.slide-out-panel-container .slide-out-content`);

			// Add content class //
			contentObj.addClass(soSettings[this.element.id].contentClass);

			if (contentHtml) {
				contentObj.html(contentHtml);

				if (!soSettings[this.element.id].showHeader) {
					contentObj.addClass('no-header').append(this.closeBtn());
				}
			}
			else {
				this.destroyPanel(this.element.id, `#${this.element.id} slot name="content" missing.`);
			}
		},
		// -------------------------- Footer //
		buildSoFooter(footerHtml) {
			const footerObj = $(`#${this.element.id}.slide-out-panel-container .slide-out-footer`);

			if (!soSettings[this.element.id].showFooter) {
				footerObj.css({ display: 'none' });
				return false;
			}

			// Add footer class //
			footerObj.addClass(soSettings[this.element.id].footerClass);

			if (footerHtml) {
				footerObj.html(footerHtml);
			}

			return false;
		},
		// -------------------------- Close button //
		closeBtn() {
			const settings = soSettings[this.element.id];

			let closeBtn = '';
			closeBtn += `<span class="close-slide-out-panel" data-id="${this.element.id}" ${settings.closeBtnSize ?
				`style="font-size: ${settings.closeBtnSize}; display: block;"` :
				''}>`;
			closeBtn += settings.closeBtn || '&#10060';
			closeBtn += '</span>';

			return closeBtn;
		},
		// ---------------------------------------------------- DESTROY PANEL //
		destroyPanel(elmId = this.element.id, msg = false) {
			$(`#${elmId}, .slide-out-panel-screen[data-id="${elmId}"]`).remove();

			if (msg) {
				console.error(`${pluginName}: ${msg}`);
			}

			return false;
		},
		// ---------------------------------------------------- CLOSE PANEL //
		closePanel(elmId) {
			const settings = soSettings[elmId];

			settings.beforeClosed.call();

			// Close Panel and adjust left/right styles //
			$(`#${elmId}`).removeClass('open').css({
				left: settings.slideFrom === 'right' ? 'initial' : `-${settings.width}`,
				right: settings.slideFrom === 'left' ? 'initial' : `-${settings.width}`,
			});

			// Hide Screen //
			$(`.slide-out-panel-screen[data-id="${elmId}"`).removeClass('open').css({
				opacity: 0,
				transitionDuration: `${settings.transitionDuration}s`,
			});

			// Move screen z-index back //
			setTimeout(() => {
				$(`.slide-out-panel-screen[data-id="${elmId}"`).css({
					zIndex: `-${settings.screenZindex}`,
				});

				settings.afterClosed.call();
			}, settings.transitionDuration * 1000);

			return false;
		},
		// ---------------------------------------------------- OPEN PANEL //
		openPanel(elmId) {
			const settings = soSettings[elmId];

			settings.beforeOpen.call();

			// Open Panel and adjust left/right styles //
			$(`#${elmId}`).addClass('open').css({
				left: settings.slideFrom === 'right' ? 'initial' : 0,
				right: settings.slideFrom === 'left' ? 'initial' : 0,
			});

			// Show Screen //
			$(`.slide-out-panel-screen[data-id="${elmId}"]`).addClass('open').css({
				opacity: 1,
				transitionDuration: `${settings.transitionDuration}s`,
				zIndex: `${settings.screenZindex}`,
			});

			setTimeout(() => {
				settings.afterOpen.call();
			}, settings.transitionDuration * 1000);

			return false;
		},
	});

	// ---------------------------------------------------- PLUGIN DEFINITION //
	$.fn[pluginName] = function(options) {
		// Check to see if element exists //
		if (typeof $(this).attr('id') === 'undefined') {
			console.error(`${pluginName}: Element not found. Element options:`, options);
			return false;
		}

		// -------------------------- Open Panel //
		this.open = function() {
			const openElemId = $(this).attr('id');
			SlideOutPanel.prototype.openPanel(openElemId);
		};

		// -------------------------- Close Panel //
		this.close = function() {
			const closeElemId = $(this).attr('id');
			SlideOutPanel.prototype.closePanel(closeElemId);
		};

		$('.close-slide-out-panel, .slide-out-panel-screen').on('click', function() {
			const closeBtnElemId = $(this).attr('data-id');
			SlideOutPanel.prototype.closePanel(closeBtnElemId);
			return false;
		});

		// -------------------------- Destroy Slide Out Panel //
		this.destroy = () => {
			const destroyElemId = $(this).attr('id');
			SlideOutPanel.prototype.destroyPanel(destroyElemId);
		};

		// -------------------------- Set Plugin //
		return this.each(function() {
			$.data(this, `plugin-${pluginName}-${$(this).attr('id')}`, new SlideOutPanel(this, options));
		});
	};
}(jQuery));
