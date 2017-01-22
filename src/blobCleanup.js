import moment from 'moment'
import { flow, sortBy, difference, last, uniq } from 'lodash'

const addCreatedAsMoment = blobs => blobs.map(blob => ({
  ...blob,
  created: moment(new Date(blob.lastModified)).utc()
}))
const sortByCreated = blobs => sortBy(blobs, 'created')
const removeCreated = blobs => blobs.map(({ created, ...blob }) => blob)

const blobsToCleanup = when => blobs => {
  const exceptLastOfTimeUnit = timeUnit => {
    const start = moment(when).subtract(2, timeUnit).startOf(timeUnit)
    const end = moment(when).subtract(2, timeUnit).endOf(timeUnit)
    const filteredBlobs = blobs.filter(blob => blob.created.isBetween(start, end, null, '[]'))

    return difference(filteredBlobs, [last(filteredBlobs)])
  }

  return [
    ...exceptLastOfTimeUnit('hour'),
    ...exceptLastOfTimeUnit('day'),
    ...exceptLastOfTimeUnit('month')
  ]
}

export default function blobCleanup({ blobs, when = moment().utc() }) {
  return flow(
    addCreatedAsMoment,
    sortByCreated,
    blobsToCleanup(when),
    uniq,
    sortByCreated,
    removeCreated
  )(blobs)
}
