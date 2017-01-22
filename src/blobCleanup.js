import moment from 'moment'
import { flow, sortBy, difference, last, uniq, range, map, flatten } from 'lodash'

const addCreatedAsMoment = blobs => blobs.map(blob => ({
  ...blob,
  created: moment(new Date(blob.lastModified)).utc()
}))
const sortByCreated = blobs => sortBy(blobs, 'created')
const removeCreated = blobs => blobs.map(({ created, ...blob }) => blob)

const blobsToCleanup = when => blobs => {
  const exceptLastOf = ({ timeUnit, ago = 2 }) => {
    const start = moment(when).subtract(ago, timeUnit).startOf(timeUnit)
    const end = moment(when).subtract(ago, timeUnit).endOf(timeUnit)
    const filteredBlobs = blobs.filter(blob => blob.created.isBetween(start, end, null, '[]'))

    return difference(filteredBlobs, [last(filteredBlobs)])
  }

  return [
    ...flatten(
      range(2, 25).map(ago => exceptLastOf({ timeUnit: 'hour', ago }))
    ),
    ...exceptLastOf({ timeUnit: 'day' }),
    ...exceptLastOf({ timeUnit: 'month' })
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
