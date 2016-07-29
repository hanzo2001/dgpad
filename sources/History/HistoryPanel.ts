
import {CenterPanel} from '../GUI/panels/CenterPanel';
import {CloseBox} from '../GUI/elements/CloseBox';
import {GUIElement} from '../GUI/elements/GUIElement';
import {Button} from '../GUI/elements/Button';
import {Label} from '../GUI/elements/Label';
import {HistoryPanel_Elt} from '../History/HistoryPanel_Elt';

var $U = (<any>window).$U;
var $P = (<any>window).$P;
var $L = (<any>window).$L;

export class HistoryPanel extends CenterPanel {
	constructor(_canvas, _closeProc) {
		super(_canvas,width,height);
		//$U.extend(this, new CenterPanel(canvas, width, height));
		var me = this;
		var canvas = _canvas;
		var width = canvas.getWidth() - 50;
		var height = $P.localstorage.iconwidth + 110;
		me.show();
		new CloseBox(me, _closeProc);
		var wout = new GUIElement(me, "div");
		wout.setAbsolute();
		wout.setColor("rgba(0,0,0,0)");
		wout.setBounds(10, height - $P.localstorage.iconwidth - 90, width - 20, $P.localstorage.iconwidth + 50);
		wout.setStyle("overflow-x", "scroll");
		var d = wout.getDocObject();
		var mwheel = function(ev) {
				d.scrollLeft += $U.extractDelta(ev);
				ev.preventDefault();
		};
		var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
		d.addEventListener(mousewheelevt, mwheel, false);
		var win = new GUIElement(me, "div");
		win.setAbsolute();
		win.setColor("rgba(0,0,0,0)");
		var winW = 0;
		for (var i = 1; i < ($P.localstorage.max + 1); i++) {
				if (localStorage.getItem($P.localstorage.base + i)) {
						winW += $P.localstorage.iconwidth + $P.localstorage.iconmargin;
						new HistoryPanel_Elt(win, canvas, i, _closeProc);
				}
		}
		win.setBounds(0, (wout.getBounds().height - $P.localstorage.iconwidth) / 2, winW, $P.localstorage.iconwidth);
		var com = new Label(me);
		com.setBounds(20, 0, width - 40, 30);
		com.setText("<p style='line-height:100%'>" + $L.history_title + "</p>");
		com.setStyles("font-size:18px;color:#222222");
		wout.addContent(win);
		me.addContent(wout);
		me.addContent(com);
		var exe = function(ev) {
				canvas.saveToLocalStorage();
				canvas.paint();
				_closeProc();
		}
		var add = new Button(me);
		add.setText("<span style='font-size:15px'>" + $L.history_save + "</span>");
		add.setBounds((width - 400) / 2, height - 35, 400, 30);
		add.addDownEvent(exe);
		me.addContent(add);
	}
}
