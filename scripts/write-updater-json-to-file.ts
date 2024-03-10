import {prepareUpdaterJson} from './prepare-updater-json'

const UPDATER_FILENAME = 'updater.json'

const updaterFile = await prepareUpdaterJson()

Bun.write(UPDATER_FILENAME, JSON.stringify(updaterFile, null, 2))
