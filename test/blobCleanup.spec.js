import { expect } from 'chai'
import moment from 'moment'
import blobCleanup from '../src/blobCleanup'
import manyBlobsInput from './manyBlobsInput'
import manyBlobsOutput from './manyBlobsOutput'

describe('Blob Cleanup', () => {
  it('should be a function', () => {
    expect(blobCleanup).to.be.instanceOf(Function)
  })
  describe('when asked to cleanup', () => {
    describe('an empty array of blobs', () => {
      it('should return the empty array', () => {
        expect(blobCleanup({
          blobs: []
        })).to.deep.equal([])
      })
    })
    describe('an arrary of one blob two hours ago', () => {
      it('should return none', () => {
        expect(blobCleanup({
          blobs: [{
            name: 'db-2017-01-21-21-22-13.archive',
            lastModified: 'Sat, 21 Jan 2017 21:22:39 GMT',
          }],
          when: moment.utc('2017-01-21 23:30:00')
        })).to.deep.equal([])
      })
    })
    describe('an arrary of two blobs', () => {
      it('should return none if only one was two hours ago', () => {
        const blobs = [{
          name: 'db-2017-01-21-22-22-13.archive',
          lastModified: 'Sat, 21 Jan 2017 22:22:39 GMT',
        }, {
          name: 'db-2017-01-21-21-21-13.archive',
          lastModified: 'Sat, 21 Jan 2017 21:22:39 GMT',
        }]
        expect(blobCleanup({
          blobs,
          when: moment.utc('2017-01-21 23:30:00')
        })).to.deep.equal([])
      })
      it('should return the earlier blob if both two hours ago', () => {
        const earlierBlob = {
          name: 'db-2017-01-21-21-22-13.archive',
          lastModified: 'Sat, 21 Jan 2017 21:22:39 GMT',
        }
        const laterBlob = {
          name: 'db-2017-01-21-21-22-30.archive',
          lastModified: 'Sat, 21 Jan 2017 21:22:50 GMT',
        }
        const blobs = [laterBlob, earlierBlob]
        expect(blobCleanup({
          blobs,
          when: moment.utc('2017-01-21 23:30:00')
        })).to.deep.equal([earlierBlob])
      })
      it('should return none if only one two days ago', () => {
        const blobs = [{
          name: 'db-2017-01-21-22-22-13.archive',
          lastModified: 'Sat, 21 Jan 2017 22:22:39 GMT',
        }, {
          name: 'db-2017-01-20-21-21-13.archive',
          lastModified: 'Sat, 20 Jan 2017 21:22:39 GMT',
        }]
        expect(blobCleanup({
          blobs,
          when: moment.utc('2017-01-22 22:30:00')
        })).to.deep.equal([])
      })
      it('should return the earlier blob if both two days ago', () => {
        const earlierBlob = {
          name: 'db-2017-01-20-21-22-13.archive',
          lastModified: 'Fri, 20 Jan 2017 21:22:39 GMT',
        }
        const laterBlob = {
          name: 'db-2017-01-20-22-22-30.archive',
          lastModified: 'Fri, 20 Jan 2017 22:22:50 GMT',
        }
        const blobs = [laterBlob, earlierBlob]
        expect(blobCleanup({
          blobs,
          when: moment.utc('2017-01-22 22:30:00')
        })).to.deep.equal([earlierBlob])
      })
      it('should return none if only one two months ago', () => {
        const blobs = [{
          name: 'db-2016-12-21-22-22-13.archive',
          lastModified: 'Wed, 21 Dec 2016 22:22:39 GMT',
        }, {
          name: 'db-2017-01-20-21-21-13.archive',
          lastModified: 'Sat, 20 Jan 2017 21:22:39 GMT',
        }]
        expect(blobCleanup({
          blobs,
          when: moment.utc('2017-02-21 22:30:00')
        })).to.deep.equal([])
      })
      it('should return the earlier blob if both two months ago', () => {
        const earlierBlob = {
          name: 'db-2016-12-20-21-22-13.archive',
          lastModified: 'Tue, 20 Dec 2016 21:22:39 GMT',
        }
        const laterBlob = {
          name: 'db-2016-12-21-22-22-30.archive',
          lastModified: 'Wed, 21 Dec 2016 22:22:50 GMT',
        }
        const blobs = [laterBlob, earlierBlob]
        expect(blobCleanup({
          blobs,
          when: moment.utc('2017-02-21 22:30:00')
        })).to.deep.equal([earlierBlob])
      })
    })
    describe('an array with extra data in the hour, day, and month slot', () => {
      it('should return the cleanup blobs for all', () => {
        expect(blobCleanup({
          blobs: [{
            lastModified: 'Mon, 21 Nov 2016 21:22:39 GMT'
          }, {
            lastModified: 'Tue, 22 Nov 2016 22:22:50 GMT'
          }, {
            lastModified: 'Thu, 19 Jan 2017 21:22:39 GMT'
          }, {
            lastModified: 'Thu, 19 Jan 2017 22:22:39 GMT'
          }, {
            lastModified: 'Sat, 21 Jan 2017 20:22:50 GMT'
          }, {
            lastModified: 'Sat, 21 Jan 2017 20:30:00 GMT'
          }],
          when: moment.utc('2017-01-21 22:30:00')
        })).to.deep.equal([{
          lastModified: 'Mon, 21 Nov 2016 21:22:39 GMT'
        }, {
          lastModified: 'Thu, 19 Jan 2017 21:22:39 GMT'
        }, {
          lastModified: 'Sat, 21 Jan 2017 20:22:50 GMT'
        }])
      })
    })
    describe('an array of many blobs', () => {
      it('should return the blobs that fit the cleanup criteria', () => {
        expect(blobCleanup({
          blobs: manyBlobsInput,
          when: moment.utc('2017-02-01 00:00:00')
        })).to.deep.equal(manyBlobsOutput)
      })
    })
  })
})