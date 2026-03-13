//
// SPDX-FileCopyrightText: 2026 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

import { get } from 'lodash-es'

export default (io, informer) => {
  const nsp = io.of('/')

  const handleEvent = (type, newObject, oldObject) => {
    const object = newObject ?? oldObject
    if (get(object, ['metadata', 'namespace']) !== 'garden') {
      return
    }
    const uid = get(object, ['metadata', 'uid'])
    const event = { uid, type }
    nsp.to('managedseeds;garden').emit('managedseeds', event)
  }

  informer.on('add', object => handleEvent('ADDED', object))
  informer.on('update', (object, oldObject) => handleEvent('MODIFIED', object, oldObject))
  informer.on('delete', object => handleEvent('DELETED', object))
}
