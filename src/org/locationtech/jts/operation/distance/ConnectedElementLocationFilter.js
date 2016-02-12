import LineString from '../../geom/LineString';
import Point from '../../geom/Point';
import Polygon from '../../geom/Polygon';
import GeometryLocation from './GeometryLocation';
import ArrayList from '../../../../../java/util/ArrayList';
import GeometryFilter from '../../geom/GeometryFilter';
export default class ConnectedElementLocationFilter {
	constructor(...args) {
		this.locations = null;
		if (args.length === 1) {
			let [locations] = args;
			this.locations = locations;
		}
	}
	get interfaces_() {
		return [GeometryFilter];
	}
	static getLocations(geom) {
		var locations = new ArrayList();
		geom.apply(new ConnectedElementLocationFilter(locations));
		return locations;
	}
	filter(geom) {
		if (geom instanceof Point || geom instanceof LineString || geom instanceof Polygon) this.locations.add(new GeometryLocation(geom, 0, geom.getCoordinate()));
	}
	getClass() {
		return ConnectedElementLocationFilter;
	}
}
