# TuongTacFree Key Monitor

Trang check quota API key tuongtacfree.

## Chay local

Mo file:

```text
CHECK_KEY_DASHBOARD.bat
```

Hoac chay PowerShell:

```powershell
cd D:\Kiro\tuongtacfree-key-monitor\checkkey-dashboard
node server.js
```

Sau do mo:

```text
http://127.0.0.1:8788/
```

Ban local co the:
- Nhap key bat ky de check.
- De trong key de dung key trong `C:\Users\<user>\.claude\settings.json`.

## Deploy GitHub Pages

Dung thu muc:

```text
docs/
```

Xem chi tiet trong:

```text
GITHUB_PAGES_DEPLOY.md
```

Luu y: khong commit API key len GitHub. Ban GitHub Pages chi nen de nguoi dung tu nhap key cua ho.
