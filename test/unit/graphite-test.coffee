async       = require 'async'
{assert}    = require 'chai'
sinon       = require 'sinon'

graphite    = require '../../lib/graphite'

describe 'Graphite connector unit Tests', ->

  stub = null

  beforeEach ->
    stub = sinon.stub graphite, "request"
    # by default on no url match, return cb(=no.1 arg) error, null
    stub.callsArgWith(1, new Error("Wrong request url error"), null)

  afterEach ->
    stub.restore()
    
  describe 'getDatapoints', ->

    expectedUrl = 'http://carbon1.gogrid.ccl:8080/render/?target=summarize(application.counters.parsers.worker.facebook_page_post_offset_aggregator.success.count,"60sec")&from=-86400sec&format=json'
    rawData = [{"target": "summarize(application.counters.parsers.worker.facebook_page_post_offset_aggregator.success.count, \"60sec\", \"sum\")", "datapoints": [[114.0, 1381857180], [77.0, 1381857240], [20.0, 1381857300]]}]
    datapoints = [[1381857180000, 114.0], [1381857240000, 77.0], [1381857300000, 20.0]]
    arg =
      path: "application.counters.parsers.worker.facebook_page_post_offset_aggregator.success.count"
      age: 60 * 60 * 24
      resolution: 60

    it 'arg.path missing', ->

      brokenArg =
        age: 60 * 60 * 24
        resolution: 60

      graphite.getDatapoints brokenArg, (err, data) ->
        assert.isFalse stub.called
        assert.isNull data
        assert.instanceOf err, Error

    it 'arg.age missing', ->

      brokenArg =
        path: "application.counters.parsers.worker.facebook_page_post_offset_aggregator.success.count"
        resolution: 60

      graphite.getDatapoints brokenArg, (err, data) ->
        assert.isFalse stub.called
        assert.isNull data
        assert.instanceOf err, Error

    it 'arg.resolution missing', ->

      brokenArg =
        path: "application.counters.parsers.worker.facebook_page_post_offset_aggregator.success.count"
        age: 60 * 60 * 24

      graphite.getDatapoints brokenArg, (err, data) ->
        assert.isFalse stub.called
        assert.isNull data
        assert.instanceOf err, Error

    it 'build correct url, returns empty data object', ->

      stub.withArgs(expectedUrl).callsArgWith(1 , null, {})
      graphite.getDatapoints arg, (err, data) ->
        assert.isTrue stub.calledOnce
        assert.isNull err
        assert.isNull data

    it 'parsers data object correctly', ->

      stub.withArgs(expectedUrl).callsArgWith(1 , null, rawData)
      graphite.getDatapoints arg, (err, data) ->
        assert.isTrue stub.calledOnce
        assert.isNull err
        assert.deepEqual data, datapoints

    it 'remove null value at the end', ->

      rawData = [{"target": "summarize(application.counters.parsers.worker.facebook_page_post_offset_aggregator.success.count, \"60sec\", \"sum\")", "datapoints": [[114.0, 1381857180], [77.0, 1381857240], [20.0, 1381857300], [null, 1381857300]]}]
      stub.withArgs(expectedUrl).callsArgWith(1 , null, rawData)
      graphite.getDatapoints arg, (err, data) ->
        assert.isTrue stub.calledOnce
        assert.isNull err
        assert.deepEqual data, datapoints