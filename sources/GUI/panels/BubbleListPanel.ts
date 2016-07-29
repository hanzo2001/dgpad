
import {Panel} from './Panel';
import {BubblePanel} from './BubblePanel';
import {Label} from '../elements/Label';
import {GUIElement} from '../elements/GUIElement';
import {HashStorageForElements as Storage} from '../../Utils/HashStorageForElements';

type StoredData = {
	panel: BubblePanel,
	data: string,
};

var dataId = 'bblLsPanel';

export class BubbleListPanel extends Panel {
	private static storage = new Storage<StoredData>(dataId);
	protected panel: BubblePanel;
	constructor(_panel: BubblePanel, _t, _w, _h, _titleheight, _title) {
		super(_panel.getDocObject());
		//$U.extend(this, new Panel(_panel.getDocObject()));
		this.setAttr('className', 'coincidenceListDIV bulle');
		this.setBounds(10, 10, _w - 20, _h - 20);
		this.panel = _panel;
		var viewportmask = new Panel(this);
		var viewport = new Panel(this);
		var title = new Label(this);
		var col = '#333';
		viewportmask.setAttr('className', 'coincidenceListViewportMask');
		viewportmask.setBounds(10, _titleheight, _w - 40, _h - (_titleheight + 35));
		viewport.setAttr('className', 'coincidenceListViewport');
		viewport.setBounds(-1, -1, _w + 10, _h - (_titleheight + 35));
		title.setText(_title);
		title.setBounds(10, 10, _w - 40, _titleheight);
		let i=0, s=_t.length;
		while (i<s) {
			var div = new GUIElement(this, 'div');
			let store: StoredData = {panel:this.panel, data:_t[i][1]};
			BubbleListPanel.storage.push(div.getDocObject(),store);// get the data and the panel to the listener
			div.setAttr('innerHTML', _t[i][0]);
			div.setStyle('color', (_t[i].length > 1) ? _t[i][2] : col);
			div.getDocObject().addEventListener('click', this.clickListener, false);
			viewport.addContent(div);
			i++;
		}
		viewportmask.addContent(viewport);
		this.addContent(title);
		this.addContent(viewportmask);
		this.show();

	}
	private clickListener(event:Event) {
		event.preventDefault();
		let div = <HTMLElement>(<any>this);
		let store = BubbleListPanel.storage.collect(div);
		setTimeout(() => {
			store.panel.close();
			div.className = 'coincidenceLIclassSel';
			store.panel.exec(store.data);
		}, 1);
	};
} 
