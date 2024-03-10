import {prepareUpdaterJson} from './prepare-updater-json'

const UPDATER_FILE_PATH = './updater/updater.json'

const updaterFile = await prepareUpdaterJson()

Bun.write(UPDATER_FILE_PATH, JSON.stringify(updaterFile, null, 2))
