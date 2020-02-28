"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function ($) {
  var pluginName = 'SlideOutPanel';
  var defaults = {
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
      target: ''
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
    afterClosed: function afterClosed() {},
    afterOpen: function afterOpen() {},
    beforeClosed: function beforeClosed() {},
    beforeOpen: function beforeOpen() {},
    rendered: function rendered() {}
  };
  var soSettings = {};

  function SlideOutPanel(element, options) {
    this.element = element;
    this.componentElm = $("#".concat(this.element.id));
    this.headerElm = $("#".concat(this.element.id, " slot[name=\"header\"]"));
    this.contentElm = $("#".concat(this.element.id, " slot[name=\"content\"]"));
    this.footerElm = $("#".concat(this.element.id, " slot[name=\"footer\"]"));

    if (typeof $(this.contentElm).html() === 'undefined') {
      this.destroyPanel(this.element.id, "#".concat(this.element.id, " slot name=\"content\" missing."));
      return false;
    }

    this.settings = this.settings || {};
    this.settings[element.id] = element;
    this.settings[element.id] = $.extend({}, defaults, options);
    soSettings[element.id] = this.settings[element.id];

    if (typeof options !== 'undefined' && typeof options.form !== 'undefined') {
      this.settings[element.id].form = $.extend({}, defaults.form, options.form);
    }

    var transitionDuration = this.settings[element.id].transitionDuration;
    transitionDuration = transitionDuration.replace('s', '');
    this.settings[element.id].transitionDuration = parseFloat(transitionDuration);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
    return false;
  }

  $.extend(SlideOutPanel.prototype, {
    init: function init() {
      $("#".concat(this.element.id)).remove();

      if (typeof $(this.contentElm).html() === 'undefined') {
        this.destroyPanel(this.element.id, "#".concat(this.element.id, " slot name=\"content\" missing."));
        return false;
      }

      this.addTemplate();
      this.settings[this.element.id].rendered.call();
      return false;
    },
    collectProperties: function collectProperties(elm) {
      var props = '';
      $(elm).each(function () {
        $.each(this.attributes, function () {
          if (this.specified && this.name !== 'name') {
            props += "".concat(this.name, "=\"").concat(this.value, "\" ");
          }
        });
      });
      return props;
    },
    addTemplate: function addTemplate() {
      var settings = this.settings[this.element.id];
      var soTemplate = '';
      soTemplate += "<div id=\"".concat(this.element.id, "\" class=\"slide-out-panel-container\" ");
      soTemplate += "".concat(this.collectProperties(this.componentElm), " >");

      if (settings.form && settings.form.active) {
        var formSettings = settings.form;
        soTemplate += '<form ';
        soTemplate += formSettings.name !== '' ? "name=\"".concat(formSettings.name, "\" ") : '';
        soTemplate += formSettings.acceptCharset !== '' ? "accept-charset=\"".concat(formSettings.acceptCharset, "\"") : '';
        soTemplate += formSettings.action !== '' ? "action=\"".concat(formSettings.action, "\" ") : '';
        soTemplate += formSettings.autocomplete !== '' ? "autocomplete=\"".concat(formSettings.autocomplete, "\" ") : '';
        soTemplate += formSettings.className !== '' ? "class=\"".concat(formSettings.className, "\" ") : '';
        soTemplate += formSettings.id !== '' ? "id=\"".concat(formSettings.id, "\" ") : '';
        soTemplate += formSettings.enctype !== '' ? "enctype=\"".concat(formSettings.enctype, "\" ") : '';
        soTemplate += formSettings.method !== '' ? "method=\"".concat(formSettings.method, "\" ") : '';
        soTemplate += formSettings.novalidate ? 'novalidate ' : '';
        soTemplate += formSettings.target !== '' ? "target=\"".concat(formSettings.target, "\" ") : '';

        if (Object.keys(formSettings.dataSet).length > 0) {
          Object.entries(formSettings.dataSet).forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                val = _ref2[1];

            soTemplate += "data-".concat(key, "=\"").concat(val, "\" ");
          });
        }

        soTemplate += formSettings.attributes !== '' ? formSettings.attributes : '';
        soTemplate += ' >';
      }

      if (settings.showHeader) {
        soTemplate += this.buildHeader();
      }

      soTemplate += this.buildContent();

      if (settings.showFooter) {
        soTemplate += this.buildFooter();
      }

      if (settings.form && settings.form.active) {
        soTemplate += '</form>';
      }

      soTemplate += '</div>';

      if (settings.showScreen) {
        soTemplate += "<div class=\"slide-out-panel-screen\" data-id=\"".concat(this.element.id, "\"></div>");
      }

      $('body').append(soTemplate);
      this.updateSections();
    },
    updateSections: function updateSections() {
      var settings = this.settings[this.element.id];
      var panelContainer = "#".concat(this.element.id, ".slide-out-panel-container");
      $(panelContainer).addClass("".concat(settings.slideFrom, " ").concat(settings.className)).css({
        display: 'block',
        height: settings.offsetTop === 0 ? 'initial' : "calc(100vh - ".concat(settings.offsetTop, ")"),
        left: settings.slideFrom === 'right' ? 'initial' : "-".concat(settings.width),
        position: settings.position,
        right: settings.slideFrom === 'left' ? 'initial' : "-".concat(settings.width),
        top: settings.offsetTop,
        transitionDuration: "".concat(settings.transitionDuration, "s"),
        width: settings.width
      });
      var headerClass = $("".concat(panelContainer, " header")).attr('class');
      $("".concat(panelContainer, " header")).attr({
        class: "slide-out-header ".concat(settings.headerClass, " ").concat(headerClass || '')
      });
      var contentClass = $("".concat(panelContainer, " section")).attr('class');
      $("".concat(panelContainer, " section")).attr({
        class: "slide-out-content ".concat(settings.contentClass, " ").concat(contentClass || '')
      });

      if (!settings.showHeader) {
        $("".concat(panelContainer, " section")).addClass('no-header').append(this.closeBtn());
      }

      var footerClass = $("".concat(panelContainer, " footer")).attr('class');
      $("".concat(panelContainer, " footer")).attr({
        class: "slide-out-footer ".concat(settings.footerClass, " ").concat(footerClass || '')
      });
      $('.slide-out-panel-screen').css({
        backgroundColor: "rgba(0, 0, 0, ".concat(settings.screenOpacity),
        transitionDuration: "".concat(settings.transitionDuration, "s"),
        zIndex: "-".concat(settings.screenZindex)
      });
    },
    buildHeader: function buildHeader() {
      var settings = this.settings[this.element.id];
      var headerElm = $(this.headerElm);
      var headerHtml = headerElm.html();
      var headerTemplate = '';
      headerTemplate += '<header ';
      headerTemplate += "".concat(this.collectProperties(headerElm), " >");

      if (!settings.headerText && !headerHtml) {
        this.destroyPanel(this.element.id, '"headerText" option is missing.');
        return false;
      }

      if (headerHtml) {
        headerTemplate += headerHtml;
        headerTemplate += this.closeBtn();
        headerTemplate += '</header>';
      } else {
        headerTemplate += "<h4>".concat(settings.headerText, "</h4>");
        headerTemplate += this.closeBtn();
        headerTemplate += '</header>';
      }

      return headerTemplate;
    },
    buildContent: function buildContent() {
      var contentElm = $(this.contentElm);
      var contentHtml = contentElm.html();
      var contentTemplate = '';
      contentTemplate += '<section ';
      contentTemplate += "".concat(this.collectProperties(contentElm), " >");
      contentTemplate += contentHtml;
      contentTemplate += '</section>';
      return contentTemplate;
    },
    buildFooter: function buildFooter() {
      var footerElm = $(this.footerElm);
      var footerHtml = footerElm.html();
      var footerTemplate = '';
      footerTemplate += '<footer ';
      footerTemplate += "".concat(this.collectProperties(footerElm), " >");
      var footerObj = $("#".concat(this.element.id, ".slide-out-panel-container .slide-out-footer"));
      footerObj.addClass(this.settings[this.element.id].footerClass);

      if (footerHtml) {
        footerTemplate += footerHtml;
      } else {
        return '';
      }

      footerTemplate += '</footer>';
      return footerTemplate;
    },
    closeBtn: function closeBtn() {
      var settings = this.settings[this.element.id];
      var closeBtn = '';
      closeBtn += "<span class=\"close-slide-out-panel\" data-id=\"".concat(this.element.id, "\" ").concat(settings.closeBtnSize ? "style=\"font-size: ".concat(settings.closeBtnSize, "; display: block;\"") : '', ">");
      closeBtn += settings.closeBtn || '&#10060';
      closeBtn += '</span>';
      return closeBtn;
    },
    closePanel: function closePanel(elmId) {
      var elm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var settings = soSettings[elmId];

      if (typeof settings === 'undefined') {
        this.destroyPanel(elmId, "#".concat(elmId, " doesn't exist."));
        return false;
      } else if ($(elm).hasClass('slide-out-panel-screen') && !settings.screenClose) {
        return false;
      }

      settings.beforeClosed.call();
      $("#".concat(elmId)).removeClass('open').css({
        left: settings.slideFrom === 'right' ? 'initial' : "-".concat(settings.width),
        right: settings.slideFrom === 'left' ? 'initial' : "-".concat(settings.width)
      });
      $(".slide-out-panel-screen[data-id=\"".concat(elmId, "\"")).removeClass('open').css({
        opacity: 0,
        transitionDuration: "".concat(settings.transitionDuration, "s")
      });
      setTimeout(function () {
        $(".slide-out-panel-screen[data-id=\"".concat(elmId, "\"")).css({
          zIndex: "-".concat(settings.screenZindex)
        });
        settings.afterClosed.call();
      }, settings.transitionDuration * 1000);
      return false;
    },
    destroyPanel: function destroyPanel() {
      var elmId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.element.id;
      var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      $("#".concat(elmId, ", .slide-out-panel-screen[data-id=\"").concat(elmId, "\"]")).remove();
      delete soSettings[elmId];

      if (msg) {
        console.error("".concat(pluginName, ": ").concat(msg));
      }

      return false;
    },
    openPanel: function openPanel(elmId) {
      var settings = soSettings[elmId];

      if (typeof settings === 'undefined') {
        this.destroyPanel(elmId, "#".concat(elmId, " doesn't exist."));
        return false;
      }

      settings.beforeOpen.call();
      $("#".concat(elmId)).addClass('open').css({
        left: settings.slideFrom === 'right' ? 'initial' : 0,
        right: settings.slideFrom === 'left' ? 'initial' : 0
      });
      $(".slide-out-panel-screen[data-id=\"".concat(elmId, "\"]")).addClass('open').css({
        opacity: 1,
        transitionDuration: "".concat(settings.transitionDuration, "s"),
        zIndex: "".concat(settings.screenZindex)
      });
      setTimeout(function () {
        settings.afterOpen.call();
      }, settings.transitionDuration * 1000);
      return false;
    }
  });

  $.fn[pluginName] = function (options) {
    var _this = this;

    if (typeof $(this).attr('id') === 'undefined') {
      console.error("".concat(pluginName, ": Element not found. Element options:"), options);
      return false;
    }

    this.close = function () {
      var closeElemId = $(this).attr('id');
      SlideOutPanel.prototype.closePanel(closeElemId);
    };

    $('body').on('click', '.close-slide-out-panel, .slide-out-panel-screen', function () {
      var closeBtnElemId = $(this).attr('data-id');
      SlideOutPanel.prototype.closePanel(closeBtnElemId, this);
      return false;
    });

    this.destroy = function () {
      var destroyElemId = $(_this).attr('id');
      SlideOutPanel.prototype.destroyPanel(destroyElemId);
    };

    this.open = function () {
      var openElemId = $(this).attr('id');
      SlideOutPanel.prototype.openPanel(openElemId);
    };

    return this.each(function () {
      $.data(this, "plugin-".concat(pluginName, "-").concat($(this).attr('id')), new SlideOutPanel(this, options));
    });
  };
})(jQuery);
