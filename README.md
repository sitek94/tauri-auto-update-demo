# Tauri + Svelte + Typescript

This template should help get you started developing with Tauri, Svelte and TypeScript in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) +
[Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) +
[Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) +
[rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer).

## Troubleshooting

### MacOS - App is damaged and can't be opened

I've been having issues with the MacOS app not opening after building. The error message is:

```plaintext
“tauri-auto-update-demo.app” is damaged and can’t be opened. You should move it to the Trash.
```

What finally worked for me:

```shell
xattr -cr ./tauri-auto-update-demo.app
```

See [this conversation with ChatGPT](https://chat.openai.com/share/0cd24f1a-17d5-4e4a-91f6-0ecaa3adb34f) for more
methods.
