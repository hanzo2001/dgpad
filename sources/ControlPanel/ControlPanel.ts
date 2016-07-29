
import {HorizontalBorderPanel} from '../GUI/panels/HorizontalBorderPanel';
import {BtnGroup} from '../GUI/elements/BtnGroup';
import {ControlButton} from './ControlButton';
import {ExportPanel} from '../Export/ExportPanel';
import {HistoryPanel} from '../History/HistoryPanel';

var $U = (<any>window).$U;
var $SCALE = (<any>window).$SCALE;
var $FPICKERFRAME = (<any>window).$FPICKERFRAME;

export class ControlPanel extends HorizontalBorderPanel {
	protected canvas;
	protected propBtn;
	protected left;
	protected size;
	protected margintop;
	protected right;
	protected copyDlog;
	protected historyDlog;
	protected modeGroup;
	protected arrowBtn;
	protected undoBtn;
	protected redoBtn;
	protected nameBtn;
	protected gridBtn;
	protected copyBtn;
	protected calcBtn;
	protected historyBtn;
	constructor(_canvas) {
		super(_canvas, _canvas.prefs.controlpanel.size, false);
		//$U.extend(this, new HorizontalBorderPanel(this.canvas, this.canvas.prefs.controlpanel.size, false));
		this.canvas = _canvas;
		var left = 10 * $SCALE;
		var size = 30 * $SCALE;
		var margintop = 5 * $SCALE;
		this.right = this.getBounds().width - left - size;
		var hspace = 15 * $SCALE;
		var smallhspace = 5 * $SCALE;
		this.copyDlog = null;
		this.historyDlog = null;
		this.modeGroup = new BtnGroup();
		this.addDownEvent(function () { });
		this.setStyle("background", this.canvas.prefs.controlpanel.color);
		this.setStyle("border-top", "1px solid hsla(0,0%,0%,.1)");
		this.setStyle("border-radius", "0px");
		this.show();
		this.arrowBtn = this.addBtnLeft("arrow", true, this.modeGroup, ()=>this.arrowMode);
		this.addSpaceLeft(hspace);
		var fingerBtn = this.addBtnLeft("finger", false, this.modeGroup, ()=>this.fingerMode);
		this.addSpaceLeft(hspace);
		var gommeBtn = this.addBtnLeft("gomme", false, this.modeGroup, ()=>this.hideMode);
		this.addSpaceLeft(hspace);
		var trashBtn = this.addBtnLeft("trash", false, this.modeGroup, ()=>this.trashMode);
		this.addSpaceLeft(hspace);
		var macrosBtn = this.addBtnLeft("macros", false, this.modeGroup, ()=>this.macroMode);
		this.addSpaceLeft(hspace);
		this.calcBtn = this.addBtnLeft("calc", false, this.modeGroup, ()=>this.calcMode);
		this.addSpaceLeft(hspace);
		if (!$U.isMobile.mobilePhone()) {
			var texBtn = this.addBtnLeft("tex", false, this.modeGroup, ()=>this.texMode);
			this.addSpaceLeft(hspace);
		}
		this.propBtn = this.addBtnLeft("properties", false, this.modeGroup, ()=>this.propsMode);
		this.addSpaceLeft(smallhspace);
		this.addSepLeft();
		this.addSpaceLeft(smallhspace);
		this.historyBtn = this.addBtnLeft("history", false, null, ()=>this.historyProc);
		this.addSpaceLeft(hspace);
		if (!$U.isMobile.mobilePhone()) {
			this.copyBtn = this.addBtnLeft("copy", false, null, ()=>this.exportProc);
			this.addSpaceLeft(hspace);
		}
		this.addBtnLeft("download", false, null, ()=>this.downloadProc);
		this.addSpaceLeft(hspace);
		this.addBtnLeft("upload", false, null, ()=>this.uploadProc);
		this.addSpaceLeft(smallhspace);
		this.addSepLeft();
		this.addSpaceLeft(smallhspace);
		this.nameBtn = this.addBtnLeft("name", false, null, ()=>this.nameProc);
		this.addSpaceLeft(hspace);
		this.gridBtn = this.addBtnLeft("grid", false, null, ()=>this.gridProc);
		this.redoBtn = this.addBtnRight("redo", true, null, ()=>this.redoProc);
		this.addSpaceRight(hspace);
		this.undoBtn = this.addBtnRight("undo", true, null, ()=>this.undoProc);
	}
	selectPropBtn() {
		this.propBtn.select();
		this.propsMode();
	}
	selectCalcBtn() {
		this.calcBtn.select();
		this.calcMode();
	}
	setUndoBtn(_active) {
		this.undoBtn.setActive(_active);
	}
	setRedoBtn(_active) {
		this.redoBtn.setActive(_active);
	}
	selectArrowBtn() {
		this.arrowBtn.select();
		this.arrowMode();
	}
	forceArrowBtn() {
		this.arrowBtn.select();
		this.canvas.setMode(1);
		this.canvas.paint();
	}
	deselectPointer() {
		this.arrowBtn.deselect();
	}
	deselectAll() {
		this.modeGroup.deselect();
	}
	selectNameBtn(_b) {
		if (_b) this.nameBtn.select()
		else this.nameBtn.deselect();
	}
	private addBtnLeft(_code, _sel, _group, _proc) {
		var btn = new ControlButton(this, this.left, this.margintop, this.size, this.size, "NotPacked/images/controls/" + _code + ".png", _sel, _group, _proc);
		this.left += this.size;
		return btn;
	}
	private addSpaceLeft(h) {
		this.left += h;
	}
	private addSepLeft() {
		var btn = new ControlButton(this, this.left, this.margintop, this.size, this.size, "NotPacked/images/controls/sep.png", true, null, null);
		this.left += this.size;
	}
	private addNullLeft() {
		var btn = new ControlButton(this, this.left, this.margintop, 0, this.size, "NotPacked/images/controls/sep.png", true, null, null);
	}
	private addBtnRight(_code, _sel, _group, _proc) {
		var btn = new ControlButton(this, this.right, this.margintop, this.size, this.size, "NotPacked/images/controls/" + _code + ".png", _sel, _group, _proc);
		this.right -= this.size;
		return btn;
	}
	private addSpaceRight(h) {
		this.right -= h;
	}
	private checkMode(_i) {
		if (this.canvas.getMode() === _i) {
			this.modeGroup.deselect();
			this.canvas.setMode(0);
			this.canvas.paint();
			return true;
		} else
			return false;
	}
	private arrowMode() {
		//        if (checkMode(1)) 
		//        this.arrowBtn.select();
		if (this.checkMode(1))
			return;
		this.canvas.setMode(1);
		this.canvas.paint();
	}
	private fingerMode() {
		//        fingerBtn.select();
		if (this.checkMode(7))
			return;
		this.canvas.setMode(7);
		this.canvas.paint();
	}
	private hideMode() {
		if (this.checkMode(2))
			return;
		this.canvas.setMode(2);
		this.canvas.paint();
	}
	private trashMode() {
		if (this.checkMode(3))
			return;
		this.canvas.setMode(3);
		this.canvas.paint();
	}
	private macroMode() {
		if (this.checkMode(4))
			return;
		// if (this.canvas.namesManager.isVisible())
		//     nameProc();
		if (this.historyDlog)
			this.historyProc();
		if (this.copyDlog)
			this.exportProc();
		this.canvas.setMode(4);
		this.canvas.paint();
	}
	private calcMode() {
		if (this.checkMode(8))
			return;
		// if (this.canvas.namesManager.isVisible())
		//     nameProc();
		if (this.historyDlog)
			this.historyProc();
		if (this.copyDlog)
			this.exportProc();
		this.canvas.setMode(8);
		this.canvas.paint();
	}
	private texMode() {
		if (this.checkMode(10))
			return;
		// if (this.canvas.namesManager.isVisible())
		//     nameProc();
		if (this.historyDlog)
			this.historyProc();
		if (this.copyDlog)
			this.exportProc();
		this.canvas.setMode(10);
		this.canvas.paint();
	}
	private propsMode() {
		if (this.checkMode(6))
			return;
		// if (this.canvas.namesManager.isVisible())
		//     nameProc();
		if (this.historyDlog)
			this.historyProc();
		if (this.copyDlog)
			this.exportProc();
		this.canvas.setMode(6);
		this.canvas.paint();
	}
	private undoProc() {
		this.canvas.undoManager.undo();
		this.canvas.refreshKeyboard();
	}
	private redoProc() {
		this.canvas.undoManager.redo();
		this.canvas.refreshKeyboard();
	}
	private nameProc() {
		if (this.canvas.namesManager.isVisible()) {
			this.canvas.namesManager.hide();
			this.nameBtn.deselect();
		} else {
			this.canvas.namesManager.show();
			this.nameBtn.select();
		}
	}
	private historyProc() {
		if (this.historyDlog) {
			this.historyDlog.close();
			this.historyDlog = null;
			this.historyBtn.deselect();
		} else {
			if (!this.canvas.getConstruction().isConsultOrArrowMode()) {
				this.arrowBtn.select();
				this.arrowMode();
			}
			if (this.copyDlog)
				this.exportProc();
			this.historyDlog = new HistoryPanel(this.canvas, this.historyProc);
			this.historyBtn.select();
		}
	}
	private gridProc() {
		if (this.canvas.isCS()) {
			this.canvas.showCS(false);
			this.gridBtn.deselect();
		} else {
			this.canvas.showCS(true);
			this.gridBtn.select();
		}
	}
	private exportProc() {
		if (this.copyDlog) {
			this.copyDlog.close();
			this.copyDlog = null;
			this.copyBtn.deselect();
		} else {
			if (this.historyDlog)
				this.historyProc();
			if (!this.canvas.getConstruction().isConsultOrArrowMode()) {
				this.arrowBtn.select();
				this.arrowMode();
			}
			this.copyDlog = new ExportPanel(this.canvas, this.exportProc);
			this.copyBtn.select();
		}
	}
	private downloadProc() {
		filepicker.pick({
			extensions: ['.txt', '.dgp'],
			// mimetype: 'text/plain',
			openTo: $U.getFilePickerDefaultBox()
		},
			function (FPFile) {
				filepicker.read(FPFile, function (data) {
					this.canvas.OpenFile("", $U.utf8_decode(data));
					if ($FPICKERFRAME !== null) {
						$FPICKERFRAME.close();
						$FPICKERFRAME = null;
					}
				});
			});
	}
	private uploadProc() {
		if (this.canvas.getConstruction().isEmpty())
			return;
		var source = this.canvas.macrosManager.getSource() + this.canvas.getConstruction().getSource() + this.canvas.textManager.getSource();
		filepicker.exportFile(
			"http://dgpad.net/scripts/NotPacked/thirdParty/temp.txt", {
				suggestedFilename: "",
				extension: ".dgp",
				services: ['DROPBOX', 'GOOGLE_DRIVE', 'BOX', 'SKYDRIVE', 'EVERNOTE', 'FTP', 'WEBDAV'],
				openTo: $U.getFilePickerDefaultBox()
			},
			function (InkBlob) {
				// console.log(InkBlob.url);
				filepicker.write(
					InkBlob,
					source, {
						base64decode: false,
						mimetype: 'text/plain'
					},
					// $U.base64_encode(source), {
					//     base64decode: true,
					//     mimetype: 'text/plain'
					// },
					function (InkBlob) {
						if ($FPICKERFRAME !== null) {
							$FPICKERFRAME.close();
							$FPICKERFRAME = null;
						}
					},
					function (FPError) {
						console.log(FPError.toString());
					}
				);
			},
			function (FPError) {
				console.log(FPError.toString());
			}
		);
		//        filepicker.store(
		//                $U.base64_encode(source),
		//                {
		//                    base64decode: true,
		//                    mimetype: 'text/plain'
		//                },
		//        function(InkBlob) {
		//            filepicker.exportFile(
		//                    InkBlob,
		//                    {suggestedFilename:"",extension: ".txt",openTo: $U.getFilePickerDefaultBox()},
		//            function(InkBlob) {
		//                if ($FPICKERFRAME !== null) {
		//                    $FPICKERFRAME.close();
		//                    $FPICKERFRAME = null;
		//                }
		//            },
		//                    function(FPError) {
		//                        console.log(FPError.toString());
		//                    }
		//            );
		//        },
		//                function(FPError) {
		//                    console.log(FPError.toString());
		//                }
		//        );
	}
}
