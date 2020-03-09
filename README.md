
jQuery SlideOutPanel
-------

[![NPM_PACKAGE](https://img.shields.io/badge/NPM%20-Package-%23cb3837)](https://www.npmjs.com/package/jquery-slideoutpanel)

Simple jQuery Plugin to add a sliding out panel.


### Installation


```
npm install --save-dev jquery-slideoutpanel
```


### Demo

[https://webdevnerdstuff.github.io/jquery-SlideOutPanel/demo.html](https://webdevnerdstuff.github.io/jquery-SlideOutPanel/demo.html)

<br>

## Usage

### HTML

The html must be set up with the proper id and internal elements.

Allowed tags: `<header>` `<section>` `<footer>`

Optional tags: `<header>` `<footer>`

Required tag: `<section>`

```html
<div id="slide-out-panel" class="slide-out-panel">
    <header>Panel Title</header>
    <section>Panel content section</section>
    <footer>Panel footer</footer>
</div>
```


### Options

<br>

Name                | Type    | Default | Options | Description
:-----              | :------ | :-----  | :-----  | :-----
bodyPush            | boolean | false   | true <br> false| Enables pushing the body when the tab opens (works with slideFrom right and left
breakpoint          | String  | 768px   | | Sets the breakpoint (matches the breakpoint in SCSS/CSS). This is used when bodyPush is true
closeBtn            | html    |  `&#10005;` <br> &#10005;  | |  Add a custom close button instead of the default
closeBtnSize        | String  | 12px    | |  Adjust the close button size
enableEscapeKey     | Boolean | false   | true <br> false |  Enables the esc key to close all panels
offsetTop           | String  | 0       | |  Offset the top of the panel
screenClose         | Boolean | true    | true <br> false |  Enables closing of panels by clicking on the background screen.
screenOpacity       | String  | 0.5     | |  Set the background screen's opacity
screenZindex        | String  | 9998    | |  Set the background screen's z-index
showScreen          | Boolean | true    | true <br> false |  Enable/Disable showing the background screen
slideFrom           | String  | right   | top <br> right <br> bottom <br> left |  Set to choose where the panel should slide out from
transition          | String  | ease    | | Set the transition-timing-function. Accepts the standard values used with CSS.
transitionDuration  | String  | 0.35s   | | Set the duration of the transitions. Adding "s" is optional.
width               | String  | 350px   | |  Set the panels width

<br>

```javascript
$('#slide-out-panel').SlideOutPanel({
    bodyPush: false,
    closeBtn: '<i class="fas fa-times"></i>',
    closeBtnSize: '',
    enableEscapeKey: true,
    offsetTop: '50px',
    screenClose: false,
    screenOpacity: '1',
    screenZindex:  '9998',
    showScreen: false,
    slideFrom: 'right',
    transition: 'ease',
    transitionDuration: '0.35s',
    width: '350px',
});
```


### Events

<br>

Name          | Description
:-----        | :-----
rendered      | Fired after the panel is finished building
beforeOpen    | Fired before panel opens
afterOpen     | Fired after panel has opened
beforeClosed  | Fired before panel is closed
afterClosed   | Fired after the panel is closed

<br>

```javascript
$('#slide-out-panel').SlideOutPanel({
    rendered() {
      // Some code...
    },
    beforeOpen() {
      // Some code...
    },
    afterOpen() {
      // Some code...
    },
    beforeClosed() {
      // Some code...
    },
    afterClosed() {
      // Some code...
    },
});
```


### Methods

<br>

Name    | Description
:-----  | :-----
open    | Opens the panel
close   | Closes the panel
toggle  | Toggles the panel open/close
destroy | Removes the panel from the DOM

<br>

```javascript
const slideOutPanel = $('#slide-out-panel').SlideOutPanel();

slideOutPanel.open();

slideOutPanel.close();

slideOutPanel.toggle();

slideOutPanel.destroy();
```


### Sass Variables

<br>

Variable                      | Default   | Description
:-----                        | :-----    | :-----
$pieces-padding               | 15px      | Padding for the panel pieces (header, section, footer)
$so-screen-sm                 | 768px     | Responsive breakpoint
$so-close-btn-color           | #000      | Color of the close button
$so-close-font-size           | 12px      | Font size of the close button
$so-container-background      | #fff      | The panel background color
$so-container-box-shadow      | -3px 3px 9px rgba(0, 0, 0, .3) | The panel box shadow
$so-container-transition      | top ease, right ease, bottom ease, left ease | Transition effect
$so-container-z-index         | 9999      | The panel z-index
$so-content-no-header-padding-top | $pieces-padding  * 2 | The top padding of the `<section>` when there is no header
$so-header-background-color   | #fff     | The header background color
$so-header-border-color       | #e5e5e5  | The header bottom border color
$so-header-border-width       | 1px      | The header border width
$so-content-background-color  | #fff     | The `<section>` background color
$so-footer-background-color   | #fff     | The `<footer>` background color

<br>

## Examples

Initialize plugin:
```javascript
$('#slide-out-panel').SlideOutPanel();
 ```

Changing the direction the panel slides out from:
```javascript
$('#slide-out-panel').SlideOutPanel({
    slideFrom: 'top',
});

$('#slide-out-panel').SlideOutPanel({
    slideFrom: 'right',
});

$('#slide-out-panel').SlideOutPanel({
    slideFrom: 'bottom',
});

$('#slide-out-panel').SlideOutPanel({
    slideFrom: 'left',
});
```

Close button customization:
```javascript
$('#slide-out-panel').SlideOutPanel({
    closeBtn: '<i class="fas fa-times"></i>',
    closeBtnSize: '18px',
});
```

Background screen customization:
```javascript
$('#slide-out-panel').SlideOutPanel({
    screenClose: true,
    screenOpacity: '0.5',
    screenZindex: '9998',
    showScreen: true,
});
```

<br>

## Dependencies

jQuery

<br>

## Change Log

[CHANGELOG](https://github.com/webdevnerdstuff/jquery-SlideOutPanel/blob/master/CHANGELOG.md)

<br>

## License

Copyright (c) 2020 WebDevNerdStuff
Licensed under the MIT license.

[![@WebDevNerdStuff](https://img.shields.io/badge/github-webdevnerdstuff-brightgreen.svg)](https://github.com/webdevnerdstuff)
