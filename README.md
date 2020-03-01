
jQuery SlideOutPanel
-------

Simple jQuery Plugin to add a sliding out panel.

#### Examples

[Basic](https://jsfiddle.net/WebDevNerdStuff/o9pk7tdn/)

#### Package Managers

TBD

## HTML
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

## Options

<table>
  <tbody>
    <tr>
      <td><strong>Name</strong></td>
      <td><strong>Type</strong></td>
      <td><strong>Default</strong></td>
      <td width="200"><strong>Options</strong></td>
      <td><strong>Description</strong></td>
    </tr>
    <tr>
      <td>bodyPush</td>
      <td>boolean</td>
      <td>false</td>
      <td>true <br> false </td>
      <td>Enables pushing the body when the tab opens (works with slideFrom right and left</td>
    </tr>
    <tr>
      <td>closeBtn</td>
      <td>html</td>
      <td>`&#10005;` <br> &#10005;</td>
      <td></td>
      <td>Add a custom close button instead of the default</td>
    </tr>
    <tr>
      <td>closeBtnSize</td>
      <td>String</td>
      <td>`12px`</td>
      <td></td>
      <td>Adjust the close button text size</td>
    </tr>
    <tr>
      <td>enableEscapeKey</td>
      <td>Boolean</td>
      <td>false</td>
      <td>true <br> false</td>
      <td>Enables the `esc` key to close all panels</td>
    </tr>
    <tr>
      <td>offsetTop</td>
      <td>String</td>
      <td>`0`</td>
      <td></td>
      <td>Offset the top of the panel</td>
    </tr>
    <tr>
      <td>screenClose</td>
      <td>Boolean</td>
      <td>true</td>
      <td>true <br> false</td>
      <td>Enables closing of panels by clicking on the background screen.</td>
    </tr>
    <tr>
      <td>screenOpacity</td>
      <td>String</td>
      <td>`0.5`</td>
      <td></td>
      <td>Set the background screen's opacity</td>
    </tr>
    <tr>
      <td>screenZindex</td>
      <td>String</td>
      <td>`9998`</td>
      <td></td>
      <td>Set the background screen's z-index</td>
    </tr>
    <tr>
      <td>showScreen</td>
      <td>Boolean</td>
      <td>true</td>
      <td>true <br> false</td>
      <td>Enable/Disable showing the background screen</td>
    </tr>
    <tr>
      <td>slideFrom</td>
      <td>String</td>
      <td>`right`</td>
      <td>top <br> right <br> bottom <br> left</td>
      <td>Set to choose where the panel should slide out from</td>
    </tr>
    <tr>
      <td>transition</td>
      <td>String</td>
      <td>`ease` </td>
      <td>ease <br> linear <br> ease-in <br> ease-out <br> ease-in-out <br> step-start <br> step-end <br> steps <br> cubic-bezier <br> initial <br> inherit</td>
      <td>Set the transitions type</td>
    </tr>
    <tr>
      <td>transitionDuration</td>
      <td>String</td>
      <td>`0.35s`</td>
      <td></td>
      <td>Set the duration of the transitions. Adding "s" is optional.</td>
    </tr>
    <tr>
      <td>width</td>
      <td>String</td>
      <td>`350px`</td>
      <td></td>
      <td>Set the panels width</td>
    </tr>
  </tbody>
</table>

```javascript
$('#slide-out-panel').SlideOutPanel({
    bodyPush: false,
    closeBtn: '<i class="fas fa-times"></i>',
    closeBtnSize: '',
    enableEscapeKey: true,
    offsetTop: '50px',
    screenClose:  false,
    screenOpacity:  '1',
    screenZindex:  '9998',
    showScreen:  false,
    slideFrom:  'right',
    transition:  'ease',
    transitionDuration:  '0.35s',
    width:  '350px',
});
```

## Events

Name | Description
:----- | :------------
`rendered` | Fired after the panel is finished building
`beforeOpen` | Fired before panel opens
`afterOpen` | Fired after panel has opened
`beforeClosed` | Fired before panel is closed
`afterClosed` | Fired after the panel is closed

Ex.

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

## Methods

Name      | Description
:-----    | :------------
`open`    | Open's the panel
`close`   | Closes the panel
`toggle`  | Toggles the panel open/close
`destroy` | Removes the panel from the DOM

Ex.
```javascript
const slideOutPanel = $('#slide-out-panel').SlideOutPanel();

slideOutPanel.open();

slideOutPanel.close();

slideOutPanel.toggle();

slideOutPanel.destroy();
```

## Sass Variables

Variable    | Type    | Default     | Description
:---------  | :-----  | :--------   | :------------
$pieces-padding | string | `15px` | Padding for the panel pieces (header, section, footer)
$so-screen-sm | | `768px` | Responsive breakpoint
$so-close-btn-color |  | `#000` | Color of the close button
$so-close-font-size |  | `12px` | Font size of the close button
$so-container-background | | `#fff` | The panel background color
$so-container-box-shadow | | `-3px 3px 9px rgba(0, 0, 0, .3)` | The panel box shadow
$so-container-transition | | `top  ease, right  ease, bottom  ease, left  ease` |
$so-container-z-index | | `9999` | The panel z-index
$so-content-no-header-padding-top | | `$pieces-padding  * 2` | The top padding of the `<section>` when there is no header
$so-header-background-color | | `#fff` | The header background color
$so-header-border-color | | `#e5e5e5` | The header bottom border color
$so-header-border-width | | `1px` | The header border width
$so-content-background-color | | `#fff` | The `<section>` background color
$so-footer-background-color | | `#fff` | The `<footer>` background color

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
    closeBtnSize:  '18px',
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

## Dependencies

jQuery

## License

Copyright (c) 2020 WebDevNerdStuff

Licensed under the MIT license.
