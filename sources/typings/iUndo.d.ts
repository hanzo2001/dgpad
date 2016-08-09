
interface iUndoManager {
	clear();
	record(target, add:boolean);
	undo();
	redo();
	beginAdd();
	endAdd();
	deleteObjs(_t);
	swap(withTarget);
	setBtns();
}
