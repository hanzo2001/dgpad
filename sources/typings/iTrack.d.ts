
declare type TrackObject = {
	startTrack: () => void,
	clearTrack: () => void,
	drawTrack: (ctx:CanvasRenderingContext2D) => void,
	isHidden: () => boolean,
};

interface iTrackManager {
	getDocObject(): HTMLCanvasElement;
	add(o:TrackObject, forced:boolean);
	remove(o:TrackObject);
	resize();
	clear();
	draw();
	setAllTrack(type, value:boolean);
}
