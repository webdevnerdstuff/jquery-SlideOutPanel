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
		form: {
			acceptCharset: '',
			action: '',
			active: false,
			attributes: '',
			autocomplete: '',
			className: '',
			dataSet: {},
			enctype: '',
			id: '',
			method: '',
			name: '',
			novalidate: false,
			target: '',
		},
		headerClass: '',
		headerText: '',
		offsetTop: 0,
    position: '',
    screenClose: true,
		screenOpacity: '0.5',
		screenZindex: '9998',
		showFooter: true,
		showHeader: true,
		showScreen: true,
		slideFrom: 'right',
		transitionDuration: '0.35s',
		width: '350px',
		// Methods //
		afterClosed() {},
		afterOpen() {},
		beforeClosed() {},
		beforeOpen() {},
		rendered() {},
	};

	const soSettings = {};

	// ---------------------------------------------------- SlideOutPanel constructor //
	function SlideOutPanel(element, options) {
		this.element = element;

		// Collect component elements //
		this.componentElm = $(`#${this.element.id}`);
		this.headerElm = $(`#${this.element.id} slot[name="header"]`);
		this.contentElm = $(`#${this.element.id} slot[name="content"]`);
		this.footerElm = $(`#${this.element.id} slot[name="footer"]`);

		// Check to make sure the content slot exists //
		if (typeof $(this.contentElm).html() === 'undefined') {
			this.destroyPanel(this.element.id, `#${this.element.id} slot name="content" missing.`);
			return false;
		}

		// Set settings //
		this.settings = this.settings || {};
		this.settings[element.id] = element;

		// Merge defaults and options //
		this.settings[element.id] = $.extend({}, defaults, options);

		// Set soSettings so open, close, and destroy have access to it's values //
		soSettings[element.id] = this.settings[element.id];

		// Merge defaults.form and options.form //
		if (typeof options !== 'undefined' && typeof options.form !== 'undefined') {
			this.settings[element.id].form = $.extend({}, defaults.form, options.form);
		}

		// Set transitionDuration to INT //
		let transitionDuration = this.settings[element.id].transitionDuration;
		transitionDuration = transitionDuration.replace('s', '');
		this.settings[element.id].transitionDuration = parseFloat(transitionDuration);

		this._defaults = defaults;
		this._name = pluginName;

		// Start building the panel //
		this.init();
		return false;
	}

	// Avoid Plugin.prototype conflicts //
	$.extend(SlideOutPanel.prototype, {
		// ---------------------------------------------------- INIT //
		init() {
			// Remove slots container //
			$(`#${this.element.id}`).remove();

			// Check to make sure the content slot exists //
			if (typeof $(this.contentElm).html() === 'undefined') {
				this.destroyPanel(this.element.id, `#${this.element.id} slot name="content" missing.`);
				return false;
			}

			// Add new container to page //
			this.addTemplate();

			// Call rendered method after panel has been built //
			this.settings[this.element.id].rendered.call();
			return false;
		},
		// ---------------------------------------------------- COLLECT PROPERTIES //
		collectProperties(elm) {
			let props = '';

			$(elm).each(function() {
				$.each(this.attributes, function() {
					if (this.specified && this.name !== 'name') {
						props += `${this.name}="${this.value}" `;
					}
				});
			});

			return props;
		},
		// ---------------------------------------------------- ADD PANEL TEMPLATE //
		addTemplate() {
			const settings = this.settings[this.element.id];
			let soTemplate = '';

			soTemplate += `<div id="${this.element.id}" class="slide-out-panel-container" `;
			soTemplate += `${this.collectProperties(this.componentElm)} >`;

			// Check if form is active //
			if (settings.form && settings.form.active) {
				const formSettings = settings.form;

				soTemplate += '<form ';
				soTemplate += formSettings.name !== '' ? `name="${formSettings.name}" ` : '';
				soTemplate += formSettings.acceptCharset !== '' ? `accept-charset="${formSettings.acceptCharset}"` : '';
				soTemplate += formSettings.action !== '' ? `action="${formSettings.action}" ` : '';
				soTemplate += formSettings.autocomplete !== '' ? `autocomplete="${formSettings.autocomplete}" ` : '';
				soTemplate += formSettings.className !== '' ? `class="${formSettings.className}" ` : '';
				soTemplate += formSettings.id !== '' ? `id="${formSettings.id}" ` : '';
				soTemplate += formSettings.enctype !== '' ? `enctype="${formSettings.enctype}" ` : '';
				soTemplate += formSettings.method !== '' ? `method="${formSettings.method}" ` : '';
				soTemplate += formSettings.novalidate ? 'novalidate ' : '';
				soTemplate += formSettings.target !== '' ? `target="${formSettings.target}" ` : '';

				// Add data sets //
				if (Object.keys(formSettings.dataSet).length > 0) {
					Object.entries(formSettings.dataSet).forEach(([key, val]) => {
						soTemplate += `data-${key}="${val}" `;
					});
				}

				soTemplate += formSettings.attributes !== '' ? formSettings.attributes : '';
				soTemplate += ' >';
			}

			// Check if header should be displayed //
			if (settings.showHeader) {
				soTemplate += this.buildHeader();
			}

			soTemplate += this.buildContent();

			// Check if footer should be displayed //
			if (settings.showFooter) {
				soTemplate += this.buildFooter();
			}

			// Check if form and close tag //
			if (settings.form && settings.form.active) {
				soTemplate += '</form>';
			}

			soTemplate += '</div>';

			// Check if background screen should be shown //
			if (settings.showScreen) {
				soTemplate += `<div class="slide-out-panel-screen" data-id="${this.element.id}"></div>`;
			}

			// Add template to DOM //
			$('body').append(soTemplate);

			// Update section styles & classes //
			this.updateSections();
		},
		// ---------------------------------------------------- UPDATE SECTIONS STYLES & CLASSES //
		updateSections() {
			const settings = this.settings[this.element.id];
			const panelContainer = `#${this.element.id}.slide-out-panel-container`;

			// -------------------------- Container //
			$(panelContainer).addClass(`${settings.slideFrom} ${settings.className}`).css({
				display: 'block',
				height: settings.offsetTop === 0 ? 'initial' : `calc(100vh - ${settings.offsetTop})`,
				left: settings.slideFrom === 'right' ? 'initial' : `-${settings.width}`,
				position: settings.position,
				right: settings.slideFrom === 'left' ? 'initial' : `-${settings.width}`,
				top: settings.offsetTop,
				transitionDuration: `${settings.transitionDuration}s`,
				width: settings.width,
			});

			// -------------------------- Header //
			const headerClass = $(`${panelContainer} header`).attr('class');

			$(`${panelContainer} header`).attr({
				class: `slide-out-header ${settings.headerClass} ${headerClass || ''}`,
			});

			// -------------------------- Content //
			const contentClass = $(`${panelContainer} section`).attr('class');

			$(`${panelContainer} section`).attr({
				class: `slide-out-content ${settings.contentClass} ${contentClass || ''}`,
			});

			// If no header, add class and append close button to content section //
			if (!settings.showHeader) {
				$(`${panelContainer} section`).addClass('no-header').append(this.closeBtn());
			}

			// -------------------------- Footer //
			const footerClass = $(`${panelContainer} footer`).attr('class');

			$(`${panelContainer} footer`).attr({
				class: `slide-out-footer ${settings.footerClass} ${footerClass || ''}`,
			});

			// -------------------------- Screen //
			$('.slide-out-panel-screen').css({
				backgroundColor: `rgba(0, 0, 0, ${settings.screenOpacity}`,
				transitionDuration: `${settings.transitionDuration}s`,
				zIndex: `-${settings.screenZindex}`,
			});
		},
		// ---------------------------------------------------- BUILD PANEL PIECES //
		// -------------------------- Header //
		buildHeader() {
			const settings = this.settings[this.element.id];
			const headerElm = $(this.headerElm);
			const headerHtml = headerElm.html();
			let headerTemplate = '';

			headerTemplate += '<header ';
			headerTemplate += `${this.collectProperties(headerElm)} >`;

			// If no headerText & no headerHtml, headerText option must be set //
			if (!settings.headerText && !headerHtml) {
				this.destroyPanel(this.element.id, '"headerText" option is missing.');
				return false;
			}

			// Check if header slot, else use options //
			if (headerHtml) {
				headerTemplate += headerHtml;
				headerTemplate += this.closeBtn();
				headerTemplate += '</header>';
			}
			else {
				headerTemplate += `<h4>${settings.headerText}</h4>`;
				headerTemplate += this.closeBtn();
				headerTemplate += '</header>';
			}

			return headerTemplate;
		},
		// -------------------------- Content //
		buildContent() {
			const contentElm = $(this.contentElm);
			const contentHtml = contentElm.html();
			let contentTemplate = '';

			contentTemplate += '<section ';
			contentTemplate += `${this.collectProperties(contentElm)} >`;
			contentTemplate += contentHtml;
			contentTemplate += '</section>';

			return contentTemplate;
		},
		// -------------------------- Footer //
		buildFooter() {
			const footerElm = $(this.footerElm);
			const footerHtml = footerElm.html();
			let footerTemplate = '';

			footerTemplate += '<footer ';
			footerTemplate += `${this.collectProperties(footerElm)} >`;

			const footerObj = $(`#${this.element.id}.slide-out-panel-container .slide-out-footer`);

			// Add footer class //
			footerObj.addClass(this.settings[this.element.id].footerClass);

			if (footerHtml) {
				footerTemplate += footerHtml;
			}
			else {
				return '';
			}

			footerTemplate += '</footer>';

			return footerTemplate;
		},
		// -------------------------- Close button //
		closeBtn() {
			const settings = this.settings[this.element.id];

			let closeBtn = '';
			closeBtn += `<span class="close-slide-out-panel" data-id="${this.element.id}" ${settings.closeBtnSize ?
				`style="font-size: ${settings.closeBtnSize}; display: block;"` :
				''}>`;
			closeBtn += settings.closeBtn || '&#10060';
			closeBtn += '</span>';

			return closeBtn;
		},
		// ---------------------------------------------------- CLOSE PANEL //
		closePanel(elmId, elm = false) {
      const settings = soSettings[elmId];

			// Check if panel exists //
			if (typeof settings === 'undefined') {
				this.destroyPanel(elmId, `#${elmId} doesn't exist.`);
				return false;
      }
      else if ($(elm).hasClass('slide-out-panel-screen') && !settings.screenClose) {
        // If screenClose is true, do not close panel when clicked //
        return false;
      }

			// Call beforeClosed method before panel is closed //
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

			setTimeout(() => {
				// Move screen z-index back //
				$(`.slide-out-panel-screen[data-id="${elmId}"`).css({
					zIndex: `-${settings.screenZindex}`,
				});

				// Call afterClosed method after panel is closed //
				settings.afterClosed.call();
			}, settings.transitionDuration * 1000);

			return false;
		},
		// ---------------------------------------------------- DESTROY PANEL //
		destroyPanel(elmId = this.element.id, msg = false) {
			$(`#${elmId}, .slide-out-panel-screen[data-id="${elmId}"]`).remove();

			// Remove panel settings //
			delete soSettings[elmId];

			// Check for message to log error //
			if (msg) {
				console.error(`${pluginName}: ${msg}`);
			}

			return false;
		},
		// ---------------------------------------------------- OPEN PANEL //
		openPanel(elmId) {
			const settings = soSettings[elmId];

			// Check if panel exists //
			if (typeof settings === 'undefined') {
				this.destroyPanel(elmId, `#${elmId} doesn't exist.`);
				return false;
			}

			// Call beforeOpen method before panel is open //
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

			// Call afterOpen method after panel is opened //
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

		// -------------------------- Close Panel //
		this.close = function() {
			const closeElemId = $(this).attr('id');
			SlideOutPanel.prototype.closePanel(closeElemId);
		};

		$('body').on('click', '.close-slide-out-panel, .slide-out-panel-screen', function() {
			const closeBtnElemId = $(this).attr('data-id');
			SlideOutPanel.prototype.closePanel(closeBtnElemId, this);
			return false;
		});

		// -------------------------- Destroy Panel //
		this.destroy = () => {
			const destroyElemId = $(this).attr('id');
			SlideOutPanel.prototype.destroyPanel(destroyElemId);
		};

		// -------------------------- Open Panel //
		this.open = function() {
			const openElemId = $(this).attr('id');
			SlideOutPanel.prototype.openPanel(openElemId);
		};

		// -------------------------- Set Plugin //
		return this.each(function() {
			$.data(this, `plugin-${pluginName}-${$(this).attr('id')}`, new SlideOutPanel(this, options));
		});
	};
}(jQuery));
