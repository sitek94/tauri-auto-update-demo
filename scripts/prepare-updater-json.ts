const OWNER = 'sitek94'
const REPO = 'tauri-auto-update-demo'
const GITHUB_TOKEN = Bun.env.GITHUB_TOKEN

enum PlatformName {
  MacOS_AARCH64 = 'macos_aarch64',
  MacOS_X86_64 = 'macos_x86_64',
  Linux_X86_64 = 'linux_x86_64',
  Windows_X86_64 = 'windows_x86_64',
}

type Version = string
type MacOSExtension = 'app.tar.gz' | 'app.tar.gz.sig' | 'dmg'
type LinuxExtension = 'deb' | 'AppImage.tar.gz' | 'AppImage.tar.gz.sig'
type WindowsExtension = 'zip' | 'msi' | 'msi.sig'
type Extension = MacOSExtension | LinuxExtension | WindowsExtension
type AssetName = `${typeof REPO}_${Version}_${PlatformName}.${Extension}`

/**
 * Create Tauri updater file based on the latest release from GitHub
 *
 * https://tauri.app/v1/guides/distribution/updater/#static-json-file
 */
export async function prepareUpdaterJson() {
  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    },
  )

  if (!response.ok) {
    console.error(await response.text())
    throw new Error('Failed to fetch latest release')
  }

  const release = (await response.json()) as {
    tag_name: string
    published_at: string
    body: string
    assets: {name: AssetName; browser_download_url: string}[]
  }

  const updaterFile = {
    version: release.tag_name,
    notes: release.body,
    pub_date: release.published_at,
    platforms: {} as Record<string, {signature: string; url: string}>,
  }

  for (const asset of release.assets) {
    const [, platformName, extension] = asset.name.match(
      /(macos_aarch64|macos_x86_64|linux_x86_64|windows_x86_64)\.(.*)$/,
    )!

    const platform = mapPlatformToTauri(platformName)
    const isSignature = extension.endsWith('.sig')
    const isSourceFile =
      extension.endsWith('.tar.gz') || extension.endsWith('.zip')

    if (!updaterFile.platforms[platform]) {
      updaterFile.platforms[platform] = {signature: '', url: ''}
    }

    if (isSignature) {
      const signatureResponse = await fetch(asset.browser_download_url)
      const signature = await signatureResponse.text()

      updaterFile.platforms[platform].signature = signature

      continue
    }

    if (isSourceFile) {
      updaterFile.platforms[platform].url = asset.browser_download_url

      continue
    }
  }

  return updaterFile
}

function mapPlatformToTauri(platform: PlatformName | string) {
  switch (platform) {
    case PlatformName.MacOS_AARCH64:
      return 'darwin-aarch64'
    case PlatformName.MacOS_X86_64:
      return 'darwin-x86_64'
    case PlatformName.Linux_X86_64:
      return 'linux-x86_64'
    case PlatformName.Windows_X86_64:
      return 'windows-x86_64'
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}
