
import {props_panel} from './props_panel';
import {Checkbox} from '../GUI/elements/Checkbox';
import {Label} from '../GUI/elements/Label';
import {ColorPicker} from '../Utils/ColorPicker';

var $L = (<any>window).$L;

export class props_messagePanel extends props_panel {
	constructor(owner) {
		super(owner);
		//$U.extend(this, new props_panel(this.owner));
		this.setAttr("className", "props_messageDIV");
		this.transition("translate_x", 0.2, 200);

		let ch = 20;

		let t1 = new Label(this);
		t1.setText($L.props_grid_message);
		t1.setStyles("color:#252525;font-style: italic");
		t1.setBounds(0, 20, 220, 20);
		this.addContent(t1);
		ch += 50;

		let t2 = new Label(this);
		t2.setText($L.props_grid_general + " :");
		t2.setStyles("font-weight:bold;font-size:16px;color:#252525");
		t2.setBounds(0, ch, 220, 20);
		this.addContent(t2);
		ch += 30;

		let cp = new ColorPicker(this.getDocObject(), 10, ch, 200, 200);
		cp.setHEXcallback(this.COLORcallback);
		cp.setHEX(this.owner.getBackgroundColor());
		ch += 210;

		let cbDemoMode = new Checkbox(this.getDocObject(), 10, ch, 200, 30, this.owner.getDemoMode(), $L.props_grid_general_demo, this.DEMOcallback);
		cbDemoMode.setTextColor("#252525");
		ch += 30;

		let cbMagnifier = new Checkbox(this.getDocObject(), 10, ch, 200, 30, this.owner.getMagnifierMode(), $L.props_general_magnifier, this.MAGNIFIERcallback);
		cbMagnifier.setTextColor("#252525");
		ch += 30;

		let cbDegree = new Checkbox(this.getDocObject(), 10, ch, 200, 30, this.owner.getDegree(), $L.props_general_degree, this.DEGREEcallback);
		cbMagnifier.setTextColor("#252525");
		ch += 30;

		let cbDragOnly = new Checkbox(this.getDocObject(), 10, ch, 200, 30, (!(this.owner.isDragOnlyMoveable())), $L.props_general_dragall, this.DRAGALLcallback);
		cbMagnifier.setTextColor("#252525");

	}
	private DEMOcallback(val) {
		//$U.setDemoMode(val);
		this.owner.setDemoMode(val);
	}
	private MAGNIFIERcallback(val) {
		this.owner.setMagnifierMode(val);
	}
	private COLORcallback(val) {
		this.owner.setBackgroundColor(val)
	}
	private DEGREEcallback(val) {
		this.owner.setDegree(val);
	}
	private DRAGALLcallback(_val){
		this.owner.setDragOnlyMoveable(!(_val));
	}
}
