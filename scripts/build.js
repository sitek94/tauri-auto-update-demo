import packageJson from '../package.json'

const name = 'tauri-auto-update-demo'
const version = packageJson.version
const base = 'src-tauri/target/release/bundle'

Bun.write(`${base}/dmg/${name}_0.0.1_aarch64.dmg`, '__test__')
Bun.write(`${base}/macos/${name}/MacOS/${name}`, '__test__')
Bun.write(`${base}/macos/${name}.app`, '__test__')
