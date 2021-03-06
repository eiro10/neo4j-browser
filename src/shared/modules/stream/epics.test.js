/*
 * Copyright (c) 2002-2017 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global describe, afterEach, test, expect, beforeAll */
import configureMockStore from 'redux-mock-store'
import { createEpicMiddleware } from 'redux-observable'
import { createBus, createReduxMiddleware } from 'suber'

import * as stream from './streamDuck'
import { update as updateSettings } from 'shared/modules/settings/settingsDuck'

const bus = createBus()
const epicMiddleware = createEpicMiddleware(stream.maxFramesConfigEpic)
const mockStore = configureMockStore([epicMiddleware, createReduxMiddleware(bus)])

describe('streamDuckEpics', () => {
  let store
  beforeAll(() => {
    store = mockStore({
      settings: {
        cmdchar: ':',
        maxFrames: 50
      },
      frames: {
        allIds: [],
        byId: {},
        maxFrames: 50
      }
    })
  })
  afterEach(() => {
    store.clearActions()
    bus.reset()
  })

  test('listens on UPDATE and sets new maxFrames', (done) => {
    // Given
    const action = updateSettings({maxFrames: 3})
    bus.take('NOOP', (currentAction) => {
      // Then
      expect(store.getActions()).toEqual([
        action,
        { type: stream.SET_MAX_FRAMES, maxFrames: 3 },
        { type: 'NOOP' }
      ])
      done()
    })

    // When
    store.dispatch(action)
  })
})
