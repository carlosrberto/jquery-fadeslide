# jQuery fadeslide

Simple jQuery plugin for create slides with fade effect.

## How to use

### Markup

```html
<div class="fade-slide">
    <ul class="fadeslide-list">
        <li><a href=""><img src="image.jpg" alt=""></a></li>
    </ul>
    <ul class="featured-slides-nav">
        <li class="fadeslide-prev"></li>
        <li class="fadeslide-next"></li>
    </ul>
</div>
```

### Basic CSS
```css
.fade-slide{
    width: 960px;
    height: 600px;
    position: relative;
}

.fadeslide-list, .fadeslide-list li{
    width: 960px;
    height: 600px;
}

.fadeslide-list{
    position: relative;
}

.fadeslide-list li{
    position: absolute;
    left: 0;
    top: 0;
}
```

### JavaScript

```javascript
$('.fade-slide').fadeslide();
```

Default options.

```javascript
$('.fade-slide').fadeslide({
    fx: {
        duration: 500
    },
    nextButton: '.fadeslide-next',
    prevButton: '.fadeslide-prev',
    loader: '.fadeslide-loader',
    duration: 2000,
    itemsSelector: '.fadeslide-list li',
    index: 0,
    auto: false
});
```
