
type Deselectable = {deselect:()=>void};

interface iBtnGroup {
	add(button);
	deselect();
}
