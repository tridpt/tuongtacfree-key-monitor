# Deploy trang check key len GitHub Pages

Thu muc dung de deploy:

```text
docs/
```

Trang nay la static HTML, khong can Node server. Moi nguoi tu nhap API key cua ho vao trinh duyet. Key khong duoc commit vao GitHub.

## Cach dua len GitHub

Trong thu muc project:

```powershell
git init
git add docs GITHUB_PAGES_DEPLOY.md
git commit -m "Add key monitor page"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

## Bat GitHub Pages

Vao GitHub repo:

```text
Settings -> Pages -> Build and deployment
```

Chon:

```text
Source: Deploy from a branch
Branch: main
Folder: /docs
```

Bam Save.

Sau do GitHub se tao link dang:

```text
https://USERNAME.github.io/REPO/
```

## Luu y bao mat

- Khong commit API key len GitHub.
- Trang chi nen co o nhap key, de nguoi dung tu nhap key cua ho.
- Neu dung chung mot key, ai co key do deu check va dung chung quota/credit.
- Key duoc luu trong localStorage cua trinh duyet neu bam "Luu key".
