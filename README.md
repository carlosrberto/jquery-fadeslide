# jQuery fadeslide

Simple jQuery plugin for create slides with fade effect.

## How to use

### Markup

```html
<div class="fadeslide">
    <ul class="fadeslide-list">
        <li><a href=""><img src="image.jpg" alt=""></a></li>
        <li><a href=""><img src="image.jpg" alt=""></a></li>
        <li><a href=""><img src="image.jpg" alt=""></a></li>
    </ul>
    <ul class="featured-slides-nav">
        <li class="fadeslide-prev"></li>
        <li class="fadeslide-next"></li>
    </ul>
</div>
```

For preload images use a `data-src` attribute on images.

```html
<div class="fadeslide">
    <ul class="fadeslide-list">
        <li><a href=""><img data-src="image.jpg" alt=""></a></li>
        <li><a href=""><img data-src="image.jpg" alt=""></a></li>
        <li><a href=""><img data-src="image.jpg" alt=""></a></li>
    </ul>
    <ul class="featured-slides-nav">
        <li class="fadeslide-prev"></li>
        <li class="fadeslide-next"></li>
    </ul>
</div>
```

### Basic CSS
```css
.fadeslide{
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
$('.fadeslide').fadeslide();
```

Default options.

```javascript
$('.fadeslide').fadeslide({
    fx: {
        duration: 500
    },
    nextButton: '.fadeslide-next',
    prevButton: '.fadeslide-prev',
    paginationEl: '.fadeslide-pagination',
    paginationItem: function(index) {
        return '<li>'+ index +'</li>';
    },
    loader: '.fadeslide-loader',
    duration: 5000,
    itemsSelector: '.fadeslide-list li',
    index: 0,
    auto: true
});
```
