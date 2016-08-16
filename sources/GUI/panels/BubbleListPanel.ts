
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
	constructor(panel:BubblePanel, _t, width:number, height:number, titleheight:number, titleStr:string) {
		super(panel);
		//$U.extend(this, new Panel(_panel.getDocObject()));
		this.setAttr('className', 'coincidenceListDIV bulle');
		this.setBounds(10, 10, width - 20, height - 20);
		this.panel = panel;
		var viewportmask = new Panel(this);
		var viewport = new Panel(this);
		var title = new Label(this);
		var col = '#333';
		viewportmask.setAttr('className', 'coincidenceListViewportMask');
		viewportmask.setBounds(10, titleheight, width - 40, height - (titleheight + 35));
		viewport.setAttr('className', 'coincidenceListViewport');
		viewport.setBounds(-1, -1, width + 10, height - (titleheight + 35));
		title.setText(titleStr);
		title.setBounds(10, 10, width - 40, titleheight);
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
