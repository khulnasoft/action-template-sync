import sinon from 'sinon'
import { join } from 'path'
import { test } from 'tap'

import core from '@actions/core'
import files from '../src/lib/files.js'
import { inspect } from 'util'

import { URL, fileURLToPath } from 'url'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

sinon.stub(core, 'info')
sinon.stub(core, 'debug')

const workspace = join(__dirname, 'fixtures/files')

test('lists all files', async assert => {
  assert.plan(3)

  const options = { files: [] }

  const contents = await files(workspace, options)

  assert.same(core.info.lastCall.args, ['found 3 files available to sync'])
  assert.same(core.debug.lastCall.args, [inspect(['file.1', 'file.2', 'file.3'])])

  assert.equal(contents.size, 3)
})

test('lists specific files', async assert => {
  assert.plan(3)

  const options = { files: ['!file.3'] }

  const contents = await files(workspace, options)

  assert.same(core.info.lastCall.args, ['found 2 files available to sync'])
  assert.same(core.debug.lastCall.args, [inspect(['file.1', 'file.2'])])

  assert.equal(contents.size, 2)
})

test('lists remapped files', async assert => {
  assert.plan(3)

  const options = { files: [{ 'file.1': '/new/path/new.name' }] }

  const contents = await files(workspace, options)

  assert.same(core.info.lastCall.args, ['found 3 files available to sync'])
  assert.same(core.debug.lastCall.args, [inspect(['/new/path/new.name', 'file.2', 'file.3'])])

  assert.equal(contents.size, 3)
})
