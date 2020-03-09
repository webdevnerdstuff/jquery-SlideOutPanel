(function($, window) {
	const pluginName = 'SlideOutPanel';

	// Create the defaults once //
	const defaults = {
		// Options //
		bodyPush: false,
		breakpoint: '768px',
		closeBtn: '&#10005;',
		closeBtnSize: '',
		enableEscapeKey: false,
		offsetTop: 0,
		screenClose: true,
		screenOpacity: '0.5',
		screenZindex: '9998',
		showScreen: true,
		slideFrom: 'right',
		transition: 'ease',
		transitionDuration: '0.35s',
		width: '350px',
		// Events //
		afterClosed() { },
		afterOpen() { },
		beforeClosed() { },
		beforeOpen() { },
		rendered() { },
	};

	let globalSettings;
	let pluginLoaded = false;

	// ---------------------------------------------------- PLUGIN DEFINITION //
	$.fn[pluginName] = function(options) {
		let componentElm;
		let headerElm;
		let contentElm;
		let footerElm;
		let screenSize;

		// Check to see if element exists //
		if (typeof $(this).attr('id') === 'undefined') {
			console.error(`${pluginName}: Element not found. Element options:`, options);
			return false;
		}

		// ---------------------------------------------------- SlideOutPanel constructor //
		function SlideOutPanel(element, soOptions) {
			// Collect component elements //
			componentElm = $(`#${element.id}`);
			headerElm = $(`#${element.id} header`);
			contentElm = $(`#${element.id} section`);
			footerElm = $(`#${element.id} footer`);

			// Add class if missing to try to prevent showing content before built //
			if (!componentElm.hasClass('slide-out-panel')) {
				componentElm.addClass('slide-out-panel');
			}
			// Check to make sure the content section exists //
			if (typeof $(contentElm).html() === 'undefined') {
				destroyPanel(element.id, `#${element.id} <section> missing.`);
				return false;
			}

			// Set settings //
			globalSettings = globalSettings || {};
			globalSettings[element.id] = element;

			// Merge defaults and options //
			globalSettings[element.id] = $.extend({}, defaults, soOptions);

			// Set transitionDuration to INT //
			let transitionDuration = globalSettings[element.id].transitionDuration;
			transitionDuration = transitionDuration.replace('s', '');
			globalSettings[element.id].transitionDuration = parseFloat(transitionDuration);

			// Window size //
			orientationChange();

			this._defaults = defaults;
			this._name = pluginName;

			// Start building the panel //
			init(element.id, globalSettings[element.id]);
			return false;
		}

		// ---------------------------------------------------- INIT //
		const init = (elmId, settings) => {
			component(elmId, settings);

			if (typeof $(headerElm).html() !== 'undefined') {
				header(elmId, settings);
			}

			content(elmId, settings);
			footer();

			// Check if background screen should be shown //
			if (settings.showScreen) {
				screen(elmId, settings);
			}

			// Call rendered method when finished with setup //
			settings.rendered();
			return false;
		};

		// ---------------------------------------------------- COMPONENT //
		const component = (elmId, settings) => {
			const openHorizontal = settings.slideFrom === 'left' || settings.slideFrom === 'right';

			componentElm
				.addClass(`slide-out-panel-container ${settings.slideFrom}`)
				.css({
					display: 'block',
					height: settings.offsetTop === 0 ? 'initial' : `calc(100vh - ${settings.offsetTop})`,
					top: settings.slideFrom === 'bottom' ? 'initial' : settings.offsetTop,
					transitionTimingFunction: `${settings.transition}`,
					transitionDuration: `${settings.transitionDuration}s`,
					width: settings.width,
				})
				.attr('data-id', elmId);

			if (settings.bodyPush && openHorizontal) {
				$('html').css({
					transition: `width ${settings.transitionDuration}s ${settings.transition}`,
				});
			}

			// Start with the panel hidden //
			// If sliding out from left or right //
			if (openHorizontal) {
				const measure = settings.width.match(/[a-zA-Z]+/);
				let num = settings.width.match(/(\d+)/);
				num = parseInt(num) + 10;

				componentElm.addClass(`slide-out-panel-container ${settings.slideFrom}`).css({
					left: settings.slideFrom !== 'left' ? 'initial' : `-${num}${measure}`,
					right: settings.slideFrom !== 'right' ? 'initial' : `-${num}${measure}`,
				});
			}
			else {
				// If sliding out from top or bottom //
				componentElm.addClass(`slide-out-panel-container ${settings.slideFrom}`).css({
					bottom: settings.slideFrom !== 'bottom' ? 'initial' : '-100%',
					top: settings.slideFrom !== 'top' ? 'initial' : '-100%',
					width: '100vw',
				});
			}
		};

		// ---------------------------------------------------- PANEL PIECES //
		// -------------------------- Header //
		const header = (elmId, settings) => {
			if (typeof headerElm.html() !== 'undefined') {
				headerElm.addClass('slide-out-header').append(closeBtn(elmId, settings));
			}
		};

		// -------------------------- Content //
		const content = (elmId, settings) => {
			contentElm.addClass('slide-out-content');

			if (typeof headerElm.html() === 'undefined') {
				contentElm.append(closeBtn(elmId, settings));
			}
		};

		// -------------------------- Footer //
		const footer = () => {
			footerElm.addClass('slide-out-footer');
		};

		// -------------------------- Close button //
		const closeBtn = (elmId, settings) => {
			let btnHtml = '';
			btnHtml += `<span class="close-slide-out-panel" data-id="${elmId}" ${settings.closeBtnSize ?
				`style="font-size: ${settings.closeBtnSize}; display: block;"` :
				''}>`;
			btnHtml += settings.closeBtn;
			btnHtml += '</span>';

			return btnHtml;
		};

		// ---------------------------------------------------- SCREEN //
		const screen = (elmId, settings) => {
			let screenHtml = '';
			screenHtml += '<div ';
			screenHtml += `id="slide-out-panel-screen-${elmId}"`;
			screenHtml += 'class="slide-out-panel-screen" ';
			screenHtml += `data-id="${elmId}" `;
			screenHtml += 'style="';
			screenHtml += `background-color: rgba(0, 0, 0, ${settings.screenOpacity});`;
			screenHtml += `transition-timing-function: ${settings.transition};`;
			screenHtml += `transition-duration: ${settings.transitionDuration}s;`;
			screenHtml += `z-index: -${settings.screenZindex};`;
			screenHtml += '">';
			screenHtml += '</div>';

			$('body').append(screenHtml);

			// Touch detection for mobile devices //
			if (settings.screenClose) {
				const touchScreen = document.getElementById(`slide-out-panel-screen-${elmId}`);

				touchScreen.addEventListener('touchend', e => {
					e.preventDefault();
					const closeBtnElemId = $(this).attr('data-id');
					closePanel(closeBtnElemId, globalSettings[closeBtnElemId], this);
					return false;
				}, false);
			}
		};

		// ---------------------------------------------------- PANEL POSITIONS //
		const panelPositions = (elmId, settings, action) => {
			const openHorizontal = settings.slideFrom === 'left' || settings.slideFrom === 'right';
			let positionVal;
			let css;

			// Set position value //
			if (action === 'open') {
				positionVal = '0';
			}
			else {
				const measure = settings.width.match(/[a-zA-Z]+/);
				let num = settings.width.match(/(\d+)/);
				num = parseInt(num) + 10;
				positionVal = openHorizontal ? `-${num}${measure}` : '-100%';
			}

			// Slide out from left or right //
			if (openHorizontal) {
				css = {
					left: settings.slideFrom === 'right' ? 'initial' : positionVal,
					right: settings.slideFrom === 'left' ? 'initial' : positionVal,
				};
			}
			else {
				// Slide out from top or bottom //
				css = {
					top: settings.slideFrom === 'bottom' ? 'initial' : positionVal,
					bottom: settings.slideFrom === 'top' ? 'initial' : positionVal,
				};
			}

			if (action === 'open') {
				$(`#${elmId}`).addClass('open');
			}
			else {
				$(`#${elmId}`).removeClass('open');
			}

			$(`#${elmId}`).css(css);
			return false;
		};

		// ---------------------------------------------------- CLOSE PANEL //
		const closePanel = (elmId = false, settings = false, elm = false) => {
			// Check if panel exists //
			if (typeof settings === 'undefined') {
				destroyPanel(elmId, `#${elmId} doesn't exist.`);
				return false;
			}
			else if ($(elm).hasClass('slide-out-panel-screen') && !settings.screenClose) {
				// If screenClose is true, do not close panel when clicked //
				return false;
			}

			// ESC Key Recursion as there is no elmId associated with it //
			if (!elmId && !settings && !elm) {
				// Close all panels //
				Object.entries(globalSettings).forEach(([key, val]) => {
					if (globalSettings[key].enableEscapeKey) {
						closePanel(key, globalSettings[key]);
					}
				});

				return false;
			}

			// Call beforeClosed method before panel is closed //
			settings.beforeClosed();

			// Close Panel and adjust left/right styles //
			panelPositions(elmId, settings, 'close');

			// Hide Screen //
			$(`#slide-out-panel-screen-${elmId}`).removeClass('open').css({
				opacity: 0,
				transitionDuration: `${settings.transitionDuration}s`,
			});

			if (settings.bodyPush && (settings.slideFrom === 'left' || settings.slideFrom === 'right')) {
				$('html').css({
					width: '100%',
				});
			}

			setTimeout(() => {
				// Move screen z-index back //
				$(`#slide-out-panel-screen-${elmId}`).css({
					zIndex: '-9999',
				});

				if (settings.bodyPush && (settings.slideFrom === 'left' || settings.slideFrom === 'right')) {
					$('html').removeClass(`slide-out-${settings.slideFrom}`).css('position', 'initial');
				}

				// Call afterClosed method after panel is closed //
				settings.afterClosed();
			}, settings.transitionDuration * 1000);

			return false;
		};

		// ---------------------------------------------------- DESTROY PANEL //
		const destroyPanel = (elmId, msg = false) => {
			$(`#${elmId}, .slide-out-panel-screen[data-id="${elmId}"]`).remove();

			// Check for message to log error //
			if (msg) {
				console.error(`${pluginName}: ${msg}`);
			}

			return false;
		};

		// ---------------------------------------------------- OPEN PANEL //
		const openPanel = (elmId = false, settings) => {
			// Check if panel exists //
			if (typeof settings === 'undefined') {
				destroyPanel(elmId, `#${elmId} doesn't exist.`);
				return false;
			}

			if (settings.bodyPush && (settings.slideFrom === 'left' || settings.slideFrom === 'right')) {
				$('html').addClass(`slide-out-${settings.slideFrom}`);
			}

			// Call beforeOpen method before panel is open //
			settings.beforeOpen();

			// Open Panel and adjust left/right styles //
			panelPositions(elmId, settings, 'open');

			// Show Screen //
			$(`#slide-out-panel-screen-${elmId}`).addClass('open').css({
				opacity: 1,
				transitionDuration: `${settings.transitionDuration}s`,
				zIndex: `${settings.screenZindex}`,
			});

			if (settings.bodyPush && (settings.slideFrom === 'left' || settings.slideFrom === 'right')) {
				$('html').css({
					position: 'absolute',
					width: `calc(${$('body').width()}px - ${settings.width}`,
				});
			}

			// Call afterOpen method after panel is opened //
			setTimeout(() => {
				settings.afterOpen();
			}, settings.transitionDuration * 1000);

			return false;
		};

		// ---------------------------------------------------- TOGGLE PANEL //
		const togglePanel = (elmId = false) => {
			if ($(`#${elmId}`).hasClass('open')) {
				closePanel(elmId, globalSettings[elmId]);
			}
			else {
				openPanel(elmId, globalSettings[elmId]);
			}

			return false;
		};

		// ---------------------------------------------------- WINDOW SIZE & ORIENTATION CHANGING //
		const orientationChange = () => {
			const screenWidth = $(window).width();

			for (let i = 0; i < Object.values(globalSettings).length; i += 1) {
				const settings = Object.values(globalSettings)[i];
				const breakpoint = settings.breakpoint.match(/(\d+)/);

				if (screenWidth < breakpoint[0] && settings.bodyPush) {
					$('html').addClass('slide-out-panel-static');
					break;
				}
				else {
					$('html').removeClass('slide-out-panel-static');

					if (settings.bodyPush && $(`.slide-out-panel-container.${settings.slideFrom}`).hasClass('open')) {
						$('html').css({
							width: `calc(${screenWidth}px - ${settings.width}`,
						});
					}
				}
			}
		};

		// Resize //
		let resizeTimer;

		$(window).on('resize', e => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				orientationChange();
			}, 250);
		});

		// ---------------------------------------------------- Public Functions //
		// -------------------------- Close Panel //
		this.close = function() {
			const closeElemId = $(this).attr('id');
			closePanel(closeElemId, globalSettings[closeElemId]);
		};

		// Click to close //
		if (!pluginLoaded) {
			$('body').on('click', '.close-slide-out-panel, .slide-out-panel-screen', function() {
				const closeBtnElemId = $(this).attr('data-id');
				closePanel(closeBtnElemId, globalSettings[closeBtnElemId], this);
				return false;
			});

			pluginLoaded = true;
		}

		// -------------------------- Escape Key to Close
		$('body').on('keyup', e => {
			if (e.keyCode === 27) {
				closePanel();
			}
		});

		// -------------------------- Destroy Panel //
		this.destroy = () => {
			const destroyElemId = $(this).attr('id');
			destroyPanel(destroyElemId);
		};

		// -------------------------- Open Panel //
		this.open = function() {
			const openElemId = $(this).attr('id');
			if (!$(`#${openElemId}`).hasClass('open')) {
				openPanel(openElemId, globalSettings[openElemId]);
			}
		};

		// -------------------------- Toggle Panel //
		this.toggle = function() {
			const openElemId = $(this).attr('id');
			togglePanel(openElemId, globalSettings[openElemId]);
		};

		// ---------------------------------------------------- Set Plugin //
		return this.each(function() {
			$.data(this, `plugin-${pluginName}-${$(this).attr('id')}`, new SlideOutPanel(this, options));
		});
	};
}(jQuery, window));
