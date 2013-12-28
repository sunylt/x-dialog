define(function(require, exports, module) {

    var $ = require("$"),
    	$window = $(window),
    	$document = $(document),
    	ie6 = $.browser.msie && $.browser.version == "6.0";
    
    var loadingHtml = '<div style="width:200px;height:100px;background:url(http://cn-style.gcimg.net/static/work/global/1.0.1/loading.gif) 50% 50% no-repeat;"></div>';

    require('./x-style.css');
   
    function XDialog() {
        this._getDOM();
        this._attachE();
    }
    
    XDialog.prototype = {
  
        init: function(config) {
			this.config = config;
			this.DOM.main.attr('id', config.id ? config.id : '');
            this.DOM.main.css('padding', config.borderWidth);
            this.DOM.content.css({'width': config.width, 'height': config.height});
            this.DOM.close[config.close ? 'show' : 'hide']();
            this.title(config.title);
            this.button(config.button);
            this.content(config.content);
            config.mask ? this.showMask() : this.hideMask();
        },
        
        title: function(t) {
            t === false ? this.DOM.title.empty().hide() : this.DOM.title.html(t).show();
        },
        
        content: function(s) {
            this.DOM.content.html(s.length ? s : loadingHtml);
            this.DOM.main.show();
            this.center();
            return this;
        },
        
        button: function(args) {
        	args = args || [];
	        var that = this;
	        var html = '';
	        this.config._callbacks = [];
	
	        this.DOM.footer[args.length ? 'show' : 'hide']();
	           
	        if (typeof args === 'string') {
	            html = args;
	        } else {
	            $.each(args, function (i, val) {
	                that.config._callbacks[i] = val.callback || '';
	                html += '<a href="javascript:;" class="x-dialog-button'+ (val.focus ? ' x-button-hilight' : '') +'">'+ val.text +'</a>';
	            });
	        }
	        this.DOM.footer.html(html);
	        return this;
        },
        
        hide: function() {
            this.DOM.main.hide();
            this.hideMask();
        },
        
        center: function() {
        	var dom = this.DOM,
        	 	main = dom.main[0],
           		fixed = this.config.fixed,
            	dl = !fixed ? 0 : $document.scrollLeft(),
            	dt = !fixed ? 0 : $document.scrollTop(),
            	ww = $window.width(),
            	wh = $window.height(),
            	ow = main.offsetWidth,
            	oh = main.offsetHeight,
            	left = (ww - ow) / 2 + dl,
            	top = (wh - oh) * 382 / 1000 + dt,// 黄金比例
            	style = main.style;

        	style.left = Math.max(parseInt(left), dl) + 'px';
       		style.top = Math.max(parseInt(top), dt) + 'px';
        	return this;
        },
        
        showMask: function() {
            this.DOM.mask.show();
            if (ie6) {
                this.DOM.mask.height($("body").height());
            }
        },
        
        hideMask: function() {
            this.DOM.mask.hide();
        },
        
        _getDOM: function() {
            var that = this,
            	_DOM = {},
            	str =   '<div class="x-dialog-mask"></div>'
					+	'<div class="x-dialog-main">'
					+		'<div class="x-dialog-inner">'
					+			'<a class="x-dialog-close" href="javascript:;">×</a>'
					+			'<table class="x-dialog-table">'
					+				'<tr>'
					+				'<td class="x-dialog-cell">'
					+					'<div class="x-dialog-title"></div>'
					+					'<div class="x-dialog-content"></div>'
					+					'<div class="x-dialog-footer"></div>'
					+				'</td>'
					+				'</tr>'
					+			'</table>'
					+		'</div>'
					+   '</div>';
					
            $(str).appendTo("body").hide();
            
            // 获取窗口各个节点
            _DOM["mask"] = $(".x-dialog-mask");
            _DOM["main"] = $(".x-dialog-main");
            _DOM["title"] = $(".x-dialog-title");
            _DOM["close"] = $(".x-dialog-close");
            _DOM["content"] = $(".x-dialog-content");
            _DOM["footer"] = $(".x-dialog-footer");
            this.DOM = _DOM;
        },
        
        _attachE: function() {
        	var that = this;
        	
            this.DOM.close.bind("click", function() {
                that.hide();
                return false;
            });
           
            $window.bind('resize scroll', function() {
            	that.center();
            });
            
		    this.DOM.main.on('click', '.x-dialog-button', function (e) {
		        var $this = $(this),
		        	index = $this.index('.x-dialog-button');
		        that._trigger(index);
		        e.preventDefault();
		    });
        },
        _trigger: function(i) {
        	var fn = this.config._callbacks[i];
        	return typeof fn !== 'function' || fn.call(this) !== false ? this.hide(): this;
    	}
    };
    
    module.exports = {
    
        // 默认配置
        _default: {
        	id: "",
            title: "标题",
            content: loadingHtml,
            mask: true,
            close: true,
            width: "",
            height: "",
            fixed: false,
            borderWidth: '5px',
            button: []
        },
        
        show: function(opts) {
            var dialog = this._getInstance(),
            	conf = $.extend({}, this._default, opts); // 传入配置和默认配置合并（覆盖上一次配置）
            
            // 应用配置初始化窗口
            dialog.init(conf);
            
            return dialog;
        },
        
        // 只被实例化一次
        _getInstance: function() {
            return this.instance || (this.instance = new XDialog());
        }
    };
    
});
