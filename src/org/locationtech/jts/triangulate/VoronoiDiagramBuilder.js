import Geometry from '../geom/Geometry'
import hasInterface from '../../../../hasInterface'
import GeometryFactory from '../geom/GeometryFactory'
import Collection from '../../../../java/util/Collection'
import IncrementalDelaunayTriangulator from './IncrementalDelaunayTriangulator'
import QuadEdgeSubdivision from './quadedge/QuadEdgeSubdivision'
import DelaunayTriangulationBuilder from './DelaunayTriangulationBuilder'
import CoordinateArrays from '../geom/CoordinateArrays'
import ArrayList from '../../../../java/util/ArrayList'
export default class VoronoiDiagramBuilder {
  constructor () {
    VoronoiDiagramBuilder.constructor_.apply(this, arguments)
  }

  static clipGeometryCollection (geom, clipEnv) {
    const clipPoly = geom.getFactory().toGeometry(clipEnv)
    const clipped = new ArrayList()
    for (let i = 0; i < geom.getNumGeometries(); i++) {
      const g = geom.getGeometryN(i)
      let result = null
      if (clipEnv.contains(g.getEnvelopeInternal())) result = g; else if (clipEnv.intersects(g.getEnvelopeInternal())) {
        result = clipPoly.intersection(g)
        result.setUserData(g.getUserData())
      }
      if (result !== null && !result.isEmpty()) {
        clipped.add(result)
      }
    }
    return geom.getFactory().createGeometryCollection(GeometryFactory.toGeometryArray(clipped))
  }

  create () {
    if (this._subdiv !== null) return null
    const siteEnv = DelaunayTriangulationBuilder.envelope(this._siteCoords)
    this._diagramEnv = siteEnv
    const expandBy = Math.max(this._diagramEnv.getWidth(), this._diagramEnv.getHeight())
    this._diagramEnv.expandBy(expandBy)
    if (this._clipEnv !== null) this._diagramEnv.expandToInclude(this._clipEnv)
    const vertices = DelaunayTriangulationBuilder.toVertices(this._siteCoords)
    this._subdiv = new QuadEdgeSubdivision(siteEnv, this._tolerance)
    const triangulator = new IncrementalDelaunayTriangulator(this._subdiv)
    triangulator.insertSites(vertices)
  }

  getDiagram (geomFact) {
    this.create()
    const polys = this._subdiv.getVoronoiDiagram(geomFact)
    return VoronoiDiagramBuilder.clipGeometryCollection(polys, this._diagramEnv)
  }

  setTolerance (tolerance) {
    this._tolerance = tolerance
  }

  setSites () {
    if (arguments[0] instanceof Geometry) {
      const geom = arguments[0]
      this._siteCoords = DelaunayTriangulationBuilder.extractUniqueCoordinates(geom)
    } else if (hasInterface(arguments[0], Collection)) {
      const coords = arguments[0]
      this._siteCoords = DelaunayTriangulationBuilder.unique(CoordinateArrays.toCoordinateArray(coords))
    }
  }

  setClipEnvelope (clipEnv) {
    this._clipEnv = clipEnv
  }

  getSubdivision () {
    this.create()
    return this._subdiv
  }

  getClass () {
    return VoronoiDiagramBuilder
  }

  get interfaces_ () {
    return []
  }
}
VoronoiDiagramBuilder.constructor_ = function () {
  this._siteCoords = null
  this._tolerance = 0.0
  this._subdiv = null
  this._clipEnv = null
  this._diagramEnv = null
}
